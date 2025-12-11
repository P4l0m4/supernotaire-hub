export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Etablissement: {
        Row: {
          siret: string;
          denomination: string;
          adresse: string;
          codePostal: string;
          commune: string;
          departement: string;
          naf: string;
          lat: number | null;
          lon: number | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          siret: string;
          denomination: string;
          adresse: string;
          codePostal: string;
          commune: string;
          departement: string;
          naf: string;
          lat?: number | null;
          lon?: number | null;
          createdAt?: string;
          updatedAt: string;
        };
        Update: {
          siret?: string;
          denomination?: string;
          adresse?: string;
          codePostal?: string;
          commune?: string;
          departement?: string;
          naf?: string;
          lat?: number | null;
          lon?: number | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      PlaceMatch: {
        Row: {
          siret: string;
          placeId: string;
          matchedName: string;
          matchedAddr: string;
          distanceM: number;
          confidence: number;
          matchedAt: string;
        };
        Insert: {
          siret: string;
          placeId: string;
          matchedName: string;
          matchedAddr: string;
          distanceM: number;
          confidence: number;
          matchedAt?: string;
        };
        Update: {
          siret?: string;
          placeId?: string;
          matchedName?: string;
          matchedAddr?: string;
          distanceM?: number;
          confidence?: number;
          matchedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PlaceMatch_siret_fkey";
            columns: ["siret"];
            referencedRelation: "Etablissement";
            referencedColumns: ["siret"];
          }
        ];
      };
      PlaceRating: {
        Row: {
          id: string;
          placeId: string;
          rating: number;
          userRatingsTotal: number;
          fetchedAt: string;
        };
        Insert: {
          id: string;
          placeId: string;
          rating: number;
          userRatingsTotal: number;
          fetchedAt?: string;
        };
        Update: {
          id?: string;
          placeId?: string;
          rating?: number;
          userRatingsTotal?: number;
          fetchedAt?: string;
        };
        Relationships: [];
      };
      Score: {
        Row: {
          id: string;
          siret: string;
          departement: string;
          commune: string;
          method: string;
          value: number;
          computedAt: string;
        };
        Insert: {
          id: string;
          siret: string;
          departement: string;
          commune: string;
          method: string;
          value: number;
          computedAt?: string;
        };
        Update: {
          id?: string;
          siret?: string;
          departement?: string;
          commune?: string;
          method?: string;
          value?: number;
          computedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Score_siret_fkey";
            columns: ["siret"];
            referencedRelation: "Etablissement";
            referencedColumns: ["siret"];
          }
        ];
      };
      _prisma_migrations: {
        Row: {
          id: string;
          checksum: string;
          finished_at: string | null;
          migration_name: string;
          logs: string | null;
          rolled_back_at: string | null;
          started_at: string;
          applied_steps_count: number;
        };
        Insert: {
          id: string;
          checksum: string;
          finished_at?: string | null;
          migration_name: string;
          logs?: string | null;
          rolled_back_at?: string | null;
          started_at?: string;
          applied_steps_count?: number;
        };
        Update: {
          id?: string;
          checksum?: string;
          finished_at?: string | null;
          migration_name?: string;
          logs?: string | null;
          rolled_back_at?: string | null;
          started_at?: string;
          applied_steps_count?: number;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
