import { Document } from '@/types/document';

interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  metadata: Record<string, any>;
}

interface Entity {
  text: string;
  type: string;
  position: { start: number; end: number };
  confidence: number;
}

interface TimelineEvent {
  date: Date;
  description: string;
  documentId: string;
  entityReferences: Entity[];
  confidence: number;
}

interface CrossReference {
  sourceDocId: string;
  targetDocId: string;
  sourceText: string;
  targetText: string;
  type: string;
  confidence: number;
}

export class DocumentProcessor {
  // Chunk size in characters
  private static CHUNK_SIZE = 1000;
  private static CHUNK_OVERLAP = 200;

  // Legal-specific patterns
  private static PATTERNS = {
    date: /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/gi,
    caseNumber: /\b\d{2}-[A-Z]{2}-\d{4,}\b|\b[A-Z]{2}\d{2}[A-Z]{2}\d{4,}\b|\b\d{1,2}:\d{2}-[a-zA-Z]{2}-\d{3,}\b/gi,
    money: /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars|USD)\b/gi,
    personName: /\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Jr\.|Sr\.|II|III|IV|Esq\.))?)\b/g,
    courtName: /\b(?:United States (?:District|Bankruptcy|Circuit|Supreme) Court|(?:Supreme|Superior|District|Circuit|Federal|State) Court|Court of (?:Appeals|Claims))\b/gi,
    legalCitation: /\b\d{1,3}\s+(?:U\.S\.|F\.|F\.\d[a-z]{1,2}|S\.Ct\.|L\.Ed\.|Cal\.|N\.Y\.|Tex\.)\s+\d{1,4}\b/gi,
    statute: /\b\d{1,2}\s+U\.S\.C\.\s+§\s*\d{1,5}(?:\([a-z]\))?\b|\b\d{1,2}\s+CFR\s+\d{1,5}\.\d{1,5}\b/gi,
    legalRole: /\b(?:plaintiff|defendant|appellant|appellee|petitioner|respondent|counsel|attorney|judge|magistrate|prosecutor|witness)\b/gi,
    jurisdiction: /\b(?:Federal|State|District|Circuit|Appellate|Supreme)\s+(?:Court|District|Jurisdiction)\b/gi,
    legalAction: /\b(?:motion|petition|complaint|appeal|objection|response|reply|brief|order|judgment|decree|verdict|settlement|stipulation)\b/gi
  };

  /**
   * Split document into overlapping chunks for processing
   */
  static chunkDocument(content: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let startIndex = 0;

    // Find natural break points (paragraphs, sections)
    const breakPoints = [...content.matchAll(/[.!?]\s+|\n\s*\n/g)].map(m => m.index);

    while (startIndex < content.length) {
      // Find the best break point within our chunk size
      const idealEnd = startIndex + this.CHUNK_SIZE;
      const breakPoint = breakPoints.find(bp => bp && bp >= idealEnd) ?? content.length;
      const endIndex = Math.min(breakPoint, content.length);

      const chunkContent = content.slice(
        startIndex,
        endIndex + (endIndex < content.length ? this.CHUNK_OVERLAP : 0)
      );

      chunks.push({
        id: `chunk-${startIndex}`,
        content: chunkContent,
        startIndex,
        endIndex,
        metadata: {
          wordCount: chunkContent.split(/\s+/).length,
          hasLegalTerms: this.containsLegalTerms(chunkContent)
        }
      });

      startIndex = Math.max(endIndex - this.CHUNK_OVERLAP, startIndex + 1);
    }

    return chunks;
  }

  private static containsLegalTerms(text: string): boolean {
    const legalTermPatterns = [
      this.PATTERNS.courtName,
      this.PATTERNS.legalCitation,
      this.PATTERNS.statute,
      this.PATTERNS.legalRole,
      this.PATTERNS.jurisdiction,
      this.PATTERNS.legalAction
    ];

    return legalTermPatterns.some(pattern => {
      pattern.lastIndex = 0; // Reset regex state
      return pattern.test(text);
    });
  }

  /**
   * Extract entities and keywords from document content
   */
  static async extractEntities(content: string): Promise<Entity[]> {
    const entities: Entity[] = [];
    
    // Extract entities using patterns
    for (const [type, pattern] of Object.entries(this.PATTERNS)) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const text = match[0];
        const confidence = this.calculateConfidence(text, type);
        
        entities.push({
          text,
          type,
          position: { start: match.index, end: match.index + text.length },
          confidence
        });
      }
    }

    // Remove duplicate entities
    return this.deduplicateEntities(entities);
  }

  private static calculateConfidence(text: string, type: string): number {
    let confidence = 0.8; // Base confidence

    // Adjust confidence based on entity type and characteristics
    switch (type) {
      case 'date':
        confidence *= text.length > 8 ? 1 : 0.9; // Longer dates are more likely to be correct
        break;
      case 'personName':
        confidence *= text.split(/\s+/).length >= 2 ? 1 : 0.7; // Full names are more likely
        break;
      case 'legalCitation':
        confidence *= text.includes('U.S.') ? 1 : 0.9; // U.S. citations are more standardized
        break;
      case 'money':
        confidence *= text.startsWith('$') ? 1 : 0.8; // Standard dollar format
        break;
    }

    return Math.min(1, confidence);
  }

  private static deduplicateEntities(entities: Entity[]): Entity[] {
    const seen = new Set<string>();
    return entities.filter(entity => {
      const key = `${entity.text}-${entity.type}-${entity.position.start}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Construct timeline from document content and extracted entities
   */
  static async constructTimeline(document: Document, entities: Entity[]): Promise<TimelineEvent[]> {
    const timelineEvents: TimelineEvent[] = [];
    const dateEntities = entities.filter(entity => entity.type === 'date');

    for (const dateEntity of dateEntities) {
      // Get surrounding context
      const contextStart = Math.max(0, dateEntity.position.start - 150);
      const contextEnd = Math.min(document.content.length, dateEntity.position.end + 150);
      const context = document.content.slice(contextStart, contextEnd);

      // Find related entities in the context
      const relatedEntities = entities.filter(e => 
        e.position.start >= contextStart && 
        e.position.end <= contextEnd &&
        e !== dateEntity
      );

      // Calculate event confidence based on related entities
      const confidence = this.calculateEventConfidence(dateEntity, relatedEntities);

      timelineEvents.push({
        date: new Date(dateEntity.text),
        description: this.extractEventDescription(context, dateEntity),
        documentId: document.id,
        entityReferences: [dateEntity, ...relatedEntities],
        confidence
      });
    }

    return timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private static calculateEventConfidence(
    dateEntity: Entity,
    relatedEntities: Entity[]
  ): number {
    let confidence = dateEntity.confidence;

    // Boost confidence if we have related legal entities
    const hasLegalEntities = relatedEntities.some(e => 
      ['legalAction', 'courtName', 'legalRole', 'legalCitation'].includes(e.type)
    );
    if (hasLegalEntities) confidence *= 1.1;

    // Reduce confidence if we have too few or too many related entities
    const entityCount = relatedEntities.length;
    if (entityCount === 0) confidence *= 0.8;
    else if (entityCount > 10) confidence *= 0.9;

    return Math.min(1, confidence);
  }

  private static extractEventDescription(context: string, dateEntity: Entity): string {
    // Find the most relevant sentence containing the date
    const sentences = context.split(/[.!?]\s+/);
    const dateSentence = sentences.find(s => s.includes(dateEntity.text)) || sentences[0];
    
    // Clean up the sentence
    return dateSentence
      .trim()
      .replace(/^\W+|\W+$/g, '') // Remove leading/trailing non-word chars
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Find patterns and relationships between documents
   */
  static async findPatterns(documents: Document[]): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];

    for (let i = 0; i < documents.length; i++) {
      const sourceDoc = documents[i];
      const sourceEntities = await this.extractEntities(sourceDoc.content);

      for (let j = i + 1; j < documents.length; j++) {
        const targetDoc = documents[j];
        const targetEntities = await this.extractEntities(targetDoc.content);

        // Find matching entities between documents
        const matches = this.findEntityMatches(sourceEntities, targetEntities);

        // Create cross-references for significant matches
        for (const match of matches) {
          if (match.confidence > 0.7) { // Only include high-confidence matches
            crossReferences.push({
              sourceDocId: sourceDoc.id,
              targetDocId: targetDoc.id,
              sourceText: match.sourceEntity.text,
              targetText: match.targetEntity.text,
              type: match.sourceEntity.type,
              confidence: match.confidence
            });
          }
        }
      }
    }

    return crossReferences;
  }

  private static findEntityMatches(
    sourceEntities: Entity[],
    targetEntities: Entity[]
  ): Array<{
    sourceEntity: Entity;
    targetEntity: Entity;
    confidence: number;
  }> {
    const matches: Array<{
      sourceEntity: Entity;
      targetEntity: Entity;
      confidence: number;
    }> = [];

    for (const sourceEntity of sourceEntities) {
      const potentialMatches = targetEntities.filter(
        targetEntity => 
          targetEntity.type === sourceEntity.type &&
          this.calculateTextSimilarity(sourceEntity.text, targetEntity.text) > 0.8
      );

      for (const targetEntity of potentialMatches) {
        const confidence = Math.min(
          sourceEntity.confidence,
          targetEntity.confidence,
          this.calculateTextSimilarity(sourceEntity.text, targetEntity.text)
        );

        matches.push({
          sourceEntity,
          targetEntity,
          confidence
        });
      }
    }

    return matches;
  }

  private static calculateTextSimilarity(text1: string, text2: string): number {
    // Simple case-insensitive exact match
    if (text1.toLowerCase() === text2.toLowerCase()) return 1;

    // Calculate Levenshtein distance for similar strings
    const distance = this.levenshteinDistance(
      text1.toLowerCase(),
      text2.toLowerCase()
    );
    const maxLength = Math.max(text1.length, text2.length);
    const similarity = 1 - distance / maxLength;

    return similarity;
  }

  private static levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1, // substitution
            dp[i - 1][j] + 1, // deletion
            dp[i][j - 1] + 1 // insertion
          );
        }
      }
    }

    return dp[m][n];
  }
} 