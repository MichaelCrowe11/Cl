-- ===================================
-- Crowe Logic AI - Mycology Knowledge Graph Schema
-- Phase 1 MVP Database Design
-- ===================================

-- Enable UUID and Vector extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ===================================
-- Core Taxonomy Tables
-- ===================================

-- Species taxonomy (15k species target for MVP)
CREATE TABLE species (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scientific_name TEXT NOT NULL UNIQUE,
    common_names TEXT[],
    kingdom TEXT DEFAULT 'Fungi',
    phylum TEXT,
    class TEXT,
    order_name TEXT,
    family TEXT,
    genus TEXT,
    species_name TEXT,
    authority TEXT, -- Author/year description
    edible_status TEXT CHECK (edible_status IN ('edible', 'poisonous', 'unknown', 'medicinal')),
    cultivation_difficulty TEXT CHECK (cultivation_difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    embedding vector(1536), -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Substrates library (200 substrates target for MVP)
CREATE TABLE substrates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('natural', 'synthetic', 'composite')),
    composition JSONB, -- Nutrient breakdown, pH, moisture, etc.
    cost_per_kg DECIMAL(10,2),
    availability TEXT CHECK (availability IN ('common', 'regional', 'specialty', 'rare')),
    sterilization_methods TEXT[],
    optimal_moisture_content DECIMAL(5,2),
    ph_range NUMRANGE,
    carbon_nitrogen_ratio DECIMAL(8,2),
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compounds (medicinal, nutritional, toxic)
CREATE TABLE compounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    chemical_formula TEXT,
    cas_number TEXT,
    molecular_weight DECIMAL(10,4),
    compound_class TEXT, -- terpene, alkaloid, polysaccharide, etc.
    bioactivity TEXT[],
    toxicity_level TEXT CHECK (toxicity_level IN ('none', 'low', 'moderate', 'high', 'lethal')),
    extraction_methods TEXT[],
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- Relationship Tables (Knowledge Graph Edges)
-- ===================================

-- Species-Substrate relationships (growth compatibility)
CREATE TABLE species_substrates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_id UUID REFERENCES species(id) ON DELETE CASCADE,
    substrate_id UUID REFERENCES substrates(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(3,2) CHECK (compatibility_score BETWEEN 0 AND 1),
    yield_potential TEXT CHECK (yield_potential IN ('low', 'medium', 'high', 'excellent')),
    colonization_time_days INTEGER,
    fruiting_time_days INTEGER,
    success_rate DECIMAL(5,2),
    notes TEXT,
    evidence_quality TEXT CHECK (evidence_quality IN ('anecdotal', 'published', 'peer_reviewed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Species-Compound relationships (what compounds are produced)
CREATE TABLE species_compounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_id UUID REFERENCES species(id) ON DELETE CASCADE,
    compound_id UUID REFERENCES compounds(id) ON DELETE CASCADE,
    concentration_range NUMRANGE, -- mg/g dry weight
    tissue_location TEXT[], -- cap, stem, mycelium, spores
    seasonal_variation JSONB,
    extraction_efficiency DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- Protocol Templates
-- ===================================

CREATE TABLE protocol_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT, -- sterilization, inoculation, fruiting, etc.
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time_hours INTEGER,
    equipment_required TEXT[],
    materials_required JSONB,
    steps JSONB, -- Array of step objects with instructions, timing, safety notes
    safety_warnings TEXT[],
    success_indicators TEXT[],
    troubleshooting JSONB,
    version TEXT DEFAULT '1.0',
    author_id UUID, -- Will reference users table when auth is implemented
    public BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- Research Data & Analytics
-- ===================================

-- User cultivation logs (for yield optimization)
CREATE TABLE cultivation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Will reference users table
    species_id UUID REFERENCES species(id),
    substrate_id UUID REFERENCES substrates(id),
    protocol_id UUID REFERENCES protocol_templates(id),
    start_date DATE,
    harvest_date DATE,
    yield_grams DECIMAL(8,2),
    contamination_rate DECIMAL(5,2),
    notes TEXT,
    environmental_data JSONB, -- temperature, humidity, CO2, etc.
    images TEXT[], -- URLs to uploaded images
    success_rating INTEGER CHECK (success_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research citations and papers
CREATE TABLE research_papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    authors TEXT[],
    journal TEXT,
    publication_date DATE,
    doi TEXT,
    pmid TEXT,
    abstract TEXT,
    keywords TEXT[],
    pdf_url TEXT,
    embedding vector(1536),
    citation_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link papers to species/substrates/compounds
CREATE TABLE research_associations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES research_papers(id) ON DELETE CASCADE,
    entity_type TEXT CHECK (entity_type IN ('species', 'substrate', 'compound')),
    entity_id UUID, -- References species, substrates, or compounds
    relevance_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================
-- Vector Search Indexes
-- ===================================

-- Create vector similarity search indexes
CREATE INDEX ON species USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON substrates USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON compounds USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX ON research_papers USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ===================================
-- Performance Indexes
-- ===================================

CREATE INDEX idx_species_scientific_name ON species(scientific_name);
CREATE INDEX idx_species_edible_status ON species(edible_status);
CREATE INDEX idx_substrates_type ON substrates(type);
CREATE INDEX idx_cultivation_logs_user_species ON cultivation_logs(user_id, species_id);
CREATE INDEX idx_protocol_templates_category ON protocol_templates(category);

-- ===================================
-- Row Level Security Preparation
-- ===================================

-- Enable RLS (will be configured when auth is implemented)
ALTER TABLE cultivation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocol_templates ENABLE ROW LEVEL SECURITY;

-- ===================================
-- Updated At Triggers
-- ===================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_substrates_updated_at BEFORE UPDATE ON substrates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compounds_updated_at BEFORE UPDATE ON compounds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocol_templates_updated_at BEFORE UPDATE ON protocol_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
