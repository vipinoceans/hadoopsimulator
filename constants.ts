
import { FlowStep, StepData } from './types';

export const STEPS: StepData[] = [
  {
    id: FlowStep.INTRO,
    title: "The Extended Hadoop Ecosystem",
    description: "Welcome to the complete Hadoop Ecosystem simulation.",
    details: [
      "Visualizing the flow of data from Ingestion to AI & Search.",
      "Now including Kafka, Storm, Mahout, Solr, and Ambari.",
      "Click 'Next' to start the journey."
    ]
  },
  {
    id: FlowStep.INGESTION,
    title: "Batch Ingestion: Flume & Sqoop",
    description: "Traditional bulk data entry into the cluster.",
    details: [
      "Flume: Ingests log data from web servers.",
      "Sqoop: Imports structured data from RDBMS.",
      "Data lands in HDFS for storage."
    ]
  },
  {
    id: FlowStep.STREAMING,
    title: "Real-Time Streaming: Kafka & Storm",
    description: "Handling high-velocity real-time data.",
    details: [
      "Kafka: Buffers massive streams of events/logs.",
      "Storm: Processes streams in real-time (filtering/alerting).",
      "ZooKeeper coordinates these distributed brokers."
    ]
  },
  {
    id: FlowStep.STORAGE_HDFS,
    title: "Storage: HDFS",
    description: "The distributed storage foundation.",
    details: [
      "NameNode: Master managing metadata.",
      "DataNodes: Slaves storing actual blocks.",
      "Replication ensures data durability."
    ]
  },
  {
    id: FlowStep.RESOURCE_YARN,
    title: "Resource Management: YARN",
    description: "The cluster operating system.",
    details: [
      "ResourceManager (RM) schedules applications.",
      "NodeManagers (NM) manage containers.",
      "Allocates resources for MR, Spark, Storm, etc."
    ]
  },
  {
    id: FlowStep.PROCESSING_MR,
    title: "Processing: MapReduce",
    description: "Batch processing engine.",
    details: [
      "Map: Processes local data.",
      "Shuffle: Redistributes data.",
      "Reduce: Aggregates results."
    ]
  },
  {
    id: FlowStep.PROCESSING_SPARK,
    title: "Processing: Apache Spark",
    description: "Fast in-memory general engine.",
    details: [
      "Up to 100x faster than MapReduce.",
      "Uses DAGs and in-memory RDDs.",
      "Runs closely with YARN for resources."
    ]
  },
  {
    id: FlowStep.ML_MAHOUT,
    title: "Machine Learning: Mahout",
    description: "Scalable machine learning library.",
    details: [
      "Runs on top of Spark or MapReduce.",
      "Executes clustering, classification, and recommendations.",
      "Leverages distributed computing for model training."
    ]
  },
  {
    id: FlowStep.QUERY_HIVE_PIG,
    title: "Query & Analysis: Hive & Pig",
    description: "SQL and Scripting interfaces.",
    details: [
      "Hive: Data warehousing with SQL syntax.",
      "Pig: Data flow scripting.",
      "Abstracts complexity of underlying jobs."
    ]
  },
  {
    id: FlowStep.NOSQL_HBASE,
    title: "NoSQL: HBase",
    description: "Random access distributed database.",
    details: [
      "Built on top of HDFS.",
      "Low-latency read/write access.",
      "Great for serving processed data."
    ]
  },
  {
    id: FlowStep.SEARCH_SOLR,
    title: "Search: Solr & Lucene",
    description: "Enterprise search and indexing.",
    details: [
      "Lucene: Powerful indexing library.",
      "Solr: Search server built on Lucene.",
      "Indexes HDFS/HBase content for fast search."
    ]
  },
  {
    id: FlowStep.WORKFLOW_OOZIE,
    title: "Workflow: Oozie",
    description: "Job scheduling and orchestration.",
    details: [
      "Manages dependencies between MR, Spark, Hive, etc.",
      "Triggers workflows based on time or data availability.",
      "Ensures complex pipelines run in order."
    ]
  },
  {
    id: FlowStep.MANAGEMENT_AMBARI,
    title: "Management: Ambari",
    description: "Cluster monitoring and provisioning.",
    details: [
      "Provides a UI for viewing cluster health.",
      "Monitors metrics (CPU, RAM, Disk).",
      "Manages configurations across all nodes."
    ]
  },
  {
    id: FlowStep.SUMMARY,
    title: "Complete Ecosystem",
    description: "The full Big Data landscape.",
    details: [
      "Ingest (Kafka/Flume) -> Process (Spark/Storm/MR).",
      "Store (HDFS/HBase) -> Analyze (Hive/Mahout/Solr).",
      "Managed by YARN, ZK, Ambari, Oozie."
    ]
  }
];

// Layout Coordinates (Percentage based 0-100)
// Optimized to fit all new components
export const POSITIONS = {
  // Sources
  SOURCE_LOGS: { x: 5, y: 15 },
  SOURCE_STREAM: { x: 5, y: 35 }, // Kafka Source
  SOURCE_DB: { x: 5, y: 85 },

  // Ingestion Layer
  FLUME: { x: 20, y: 15 },
  KAFKA: { x: 20, y: 35 },
  STORM: { x: 32, y: 35 },
  SQOOP: { x: 20, y: 85 },

  // Masters / Management (Top & Center)
  ZOOKEEPER: { x: 40, y: 8 },
  NAMENODE: { x: 55, y: 8 },
  AMBARI: { x: 70, y: 8 }, // Top right-ish
  RESOURCEMANAGER: { x: 50, y: 25 },

  // Workflow (Side)
  OOZIE: { x: 10, y: 60 },

  // Workers / Storage (Bottom Center)
  DATANODE_1: { x: 40, y: 75 },
  DATANODE_2: { x: 60, y: 75 },
  DATANODE_3: { x: 80, y: 75 },

  // Processing & Tools (Right Side)
  MAPREDUCE: { x: 60, y: 55 }, // Center processing
  HIVE: { x: 85, y: 20 },
  PIG: { x: 72, y: 20 },
  SPARK: { x: 60, y: 25 },
  MAHOUT: { x: 65, y: 40 }, // Near Spark/Processing center
  HBASE: { x: 90, y: 55 },
  SOLR: { x: 90, y: 75 }, // Near Storage
};
