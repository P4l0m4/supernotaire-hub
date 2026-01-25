import { processDocument } from "@/utils/textFromDocument";
import { extractDataFromResults } from "@/utils/AIExtraction";

interface QueueItem {
  id: string;
  file: File;
  key: string;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

type ProcessingDeps = {
  resolveTsTypeFor: (key: string) => string | null;
  getFormData: () => Record<string, any>;
};

class ProcessingQueue {
  private queue: QueueItem[] = [];
  private processing = new Set<string>();
  private maxConcurrent = 2;
  private processingDelay = 1000;
  private deps: ProcessingDeps | null = null;

  setDependencies(deps: ProcessingDeps) {
    this.deps = deps;
  }

  async addToQueue(key: string, file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        id: `${key}-${Date.now()}`,
        file,
        key,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(item);
      this.processQueue();
    });
  }

  private processQueue() {
    if (!this.deps) return;

    while (
      this.processing.size < this.maxConcurrent &&
      this.queue.length > 0
    ) {
      const item = this.queue.shift();
      if (!item) break;
      this.runItem(item);
    }
  }

  private async runItem(item: QueueItem) {
    this.processing.add(item.id);

    try {
      await new Promise((resolve) => setTimeout(resolve, this.processingDelay));
      const result = await this.processItem(item);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.processing.delete(item.id);
      this.processQueue();
    }
  }

  private async processItem(item: QueueItem): Promise<any> {
    if (!this.deps) return null;
    const { resolveTsTypeFor, getFormData } = this.deps;

    const { results } = await processDocument(item.file);
    const TS_TYPE = resolveTsTypeFor(item.key);

    if (!TS_TYPE) return null;

    const formData = getFormData();
    const nomVendeur = formData?.documents?.vendeur_nom || "";
    const clues = [`Le nom du vendeur est : ${nomVendeur}.`].filter(
      (c) => c.trim().length > 0,
    );

    return await extractDataFromResults([], results, item.key, TS_TYPE, clues);
  }

  getQueueStatus() {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.maxConcurrent,
    };
  }
}

export const processingQueue = new ProcessingQueue();
