
export enum FlowStep {
  INTRO = 0,
  INGESTION = 1,
  STREAMING = 2, // New: Kafka & Storm
  STORAGE_HDFS = 3,
  RESOURCE_YARN = 4,
  PROCESSING_MR = 5,
  PROCESSING_SPARK = 6,
  ML_MAHOUT = 7, // New: Mahout
  QUERY_HIVE_PIG = 8,
  NOSQL_HBASE = 9,
  SEARCH_SOLR = 10, // New: Solr/Lucene
  WORKFLOW_OOZIE = 11,
  MANAGEMENT_AMBARI = 12, // New: Ambari
  SUMMARY = 13,
}

export interface StepData {
  id: FlowStep;
  title: string;
  description: string;
  details: string[];
}

export interface Position {
  x: number;
  y: number;
}
