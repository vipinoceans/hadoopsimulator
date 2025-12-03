
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FlowStep } from '../types';
import { POSITIONS } from '../constants';
import { 
  Database, 
  FileText, 
  Server, 
  Cpu, 
  Layers, 
  Table, 
  Activity, 
  Share2, 
  GitBranch, 
  Eye,
  Settings,
  Zap,
  MessageCircle,
  Brain,
  Search,
  Monitor,
  Box
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface SimulationCanvasProps {
  step: FlowStep;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ step }) => {
  const flowLine: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  // Node Component
  const NodeIcon = ({ icon: Icon, x, y, label, color, active, subLabel }: any) => (
    <motion.div 
      className="absolute flex flex-col items-center justify-center z-20"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      animate={active ? { scale: 1.15 } : { scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <Tooltip text={subLabel || label}>
        <div className={`p-2 lg:p-3 rounded-xl shadow-lg border-2 transition-colors duration-500 ${active ? `bg-slate-800 border-${color}-400 shadow-${color}-500/20` : 'bg-slate-900 border-slate-700'}`}>
          <Icon size={20} className={active ? `text-${color}-400` : 'text-slate-600'} />
        </div>
      </Tooltip>
      <span className={`mt-1 text-[10px] lg:text-xs font-bold whitespace-nowrap ${active ? `text-${color}-400` : 'text-slate-700'}`}>{label}</span>
    </motion.div>
  );

  // Data Packet Component
  const DataPacket = ({ from, to, color, delay = 0, duration = 2, repeat = true, repeatDelay = 1, size = 3 }: any) => (
    <motion.div
      className={`absolute rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(var(--color-${color}-500),0.8)] z-30 pointer-events-none`}
      style={{ width: size * 4, height: size * 4 }} // scaling size for visibility
      initial={{ left: `${from.x}%`, top: `${from.y}%`, opacity: 0 }}
      animate={{ 
        left: [`${from.x}%`, `${to.x}%`], 
        top: [`${from.y}%`, `${to.y}%`],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: duration, 
        ease: "easeInOut", 
        delay: delay, 
        repeat: repeat ? Infinity : 0,
        repeatDelay: repeatDelay
      }}
    />
  );

  // Connection Line Component (SVG)
  const Connection = ({ from, to, active, color, dashed = false, pulse = false }: any) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    // slightly curve
    const path = `M ${from.x} ${from.y} Q ${midX} ${midY + (from.y === to.y ? 5 : 0)} ${to.x} ${to.y}`;

    return (
      <motion.path
        d={path}
        fill="transparent"
        strokeWidth={active ? "0.6" : "0.2"} // Reduced from 2/1 to 0.6/0.2 for cleaner look
        stroke={active ? color : "#1e293b"}
        strokeDasharray={dashed || !active ? "3,3" : "0"}
        initial="hidden"
        animate={active && pulse ? { strokeOpacity: [0.4, 1, 0.4], strokeWidth: [0.6, 1.2, 0.6] } : "visible"}
        transition={pulse ? { duration: 2, repeat: Infinity } : {}}
        variants={flowLine}
      />
    );
  };
  
  // --- Step Renderers ---

  const renderIngestion = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
         <Connection from={POSITIONS.SOURCE_LOGS} to={POSITIONS.FLUME} active={true} color="#60a5fa" />
         <Connection from={POSITIONS.FLUME} to={POSITIONS.NAMENODE} active={true} color="#60a5fa" dashed />
         <Connection from={POSITIONS.FLUME} to={POSITIONS.DATANODE_1} active={true} color="#60a5fa" />
         
         <Connection from={POSITIONS.SOURCE_DB} to={POSITIONS.SQOOP} active={true} color="#4ade80" />
         <Connection from={POSITIONS.SQOOP} to={POSITIONS.NAMENODE} active={true} color="#4ade80" dashed />
         <Connection from={POSITIONS.SQOOP} to={POSITIONS.DATANODE_3} active={true} color="#4ade80" />
      </svg>

      {/* Flume Flow */}
      <DataPacket from={POSITIONS.SOURCE_LOGS} to={POSITIONS.FLUME} color="blue" delay={0} />
      <DataPacket from={POSITIONS.FLUME} to={POSITIONS.NAMENODE} color="blue" delay={1} duration={1} />
      <DataPacket from={POSITIONS.FLUME} to={POSITIONS.DATANODE_1} color="blue" delay={1.5} />
      
      {/* Sqoop Flow */}
      <DataPacket from={POSITIONS.SOURCE_DB} to={POSITIONS.SQOOP} color="green" delay={0.5} />
      <DataPacket from={POSITIONS.SQOOP} to={POSITIONS.NAMENODE} color="green" delay={1.5} duration={1} />
      <DataPacket from={POSITIONS.SQOOP} to={POSITIONS.DATANODE_3} color="green" delay={2.0} />
    </>
  );

  const renderStreaming = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
         <Connection from={POSITIONS.SOURCE_STREAM} to={POSITIONS.KAFKA} active={true} color="#a855f7" />
         <Connection from={POSITIONS.KAFKA} to={POSITIONS.STORM} active={true} color="#a855f7" />
         <Connection from={POSITIONS.STORM} to={POSITIONS.DATANODE_2} active={true} color="#f59e0b" />
         {/* ZK Coordination */}
         <Connection from={POSITIONS.ZOOKEEPER} to={POSITIONS.KAFKA} active={true} color="#10b981" dashed pulse />
         <Connection from={POSITIONS.ZOOKEEPER} to={POSITIONS.STORM} active={true} color="#10b981" dashed pulse />
      </svg>

      {/* Stream Flow */}
      {/* High velocity packets */}
      <DataPacket from={POSITIONS.SOURCE_STREAM} to={POSITIONS.KAFKA} color="purple" delay={0} duration={0.8} repeatDelay={0.2} />
      <DataPacket from={POSITIONS.SOURCE_STREAM} to={POSITIONS.KAFKA} color="purple" delay={0.4} duration={0.8} repeatDelay={0.2} />
      
      {/* Kafka Buffer */}
      <motion.div 
        className="absolute text-purple-400 font-bold text-[10px]" 
        style={{ left: `${POSITIONS.KAFKA.x}%`, top: `${POSITIONS.KAFKA.y + 8}%` }}
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }}
      >
        BUFFERING...
      </motion.div>

      {/* Storm Processing */}
      <DataPacket from={POSITIONS.KAFKA} to={POSITIONS.STORM} color="purple" delay={0.8} duration={0.8} repeatDelay={0.2} />
      
      {/* Storm Bolt Animation */}
      <motion.div
        className="absolute text-yellow-400"
        style={{ left: `${POSITIONS.STORM.x}%`, top: `${POSITIONS.STORM.y}%`, transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Zap size={30} fill="currentColor" />
      </motion.div>

      {/* To Storage */}
      <DataPacket from={POSITIONS.STORM} to={POSITIONS.DATANODE_2} color="yellow" delay={1.6} duration={1} />
    </>
  );

  const renderHDFS = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         <Connection from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_1} active={true} color="#06b6d4" />
         <Connection from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_2} active={true} color="#06b6d4" />
         <Connection from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_3} active={true} color="#06b6d4" />
      </svg>

      <DataPacket from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_1} color="cyan" delay={0} duration={1} />
      <DataPacket from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_2} color="cyan" delay={0.2} duration={1} />
      <DataPacket from={POSITIONS.NAMENODE} to={POSITIONS.DATANODE_3} color="cyan" delay={0.4} duration={1} />

      <DataPacket from={POSITIONS.DATANODE_1} to={POSITIONS.DATANODE_2} color="purple" delay={1} />
      <DataPacket from={POSITIONS.DATANODE_2} to={POSITIONS.DATANODE_3} color="purple" delay={2} />
    </>
  );

  const renderYARN = () => {
    const loopDelay = 6; 
    return (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Connection from={POSITIONS.HIVE} to={POSITIONS.RESOURCEMANAGER} active={true} color="#ec4899" />
          <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_1} active={true} color="#eab308" />
          <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} active={true} color="#eab308" />
          <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} active={true} color="#eab308" />
      </svg>

      {/* 1. App Submit */}
      <DataPacket from={POSITIONS.HIVE} to={POSITIONS.RESOURCEMANAGER} color="pink" delay={0} duration={1.5} repeatDelay={loopDelay} />
      
      {/* 2. RM Schedule */}
      <motion.div
        className="absolute"
        style={{ left: `${POSITIONS.RESOURCEMANAGER.x}%`, top: `${POSITIONS.RESOURCEMANAGER.y}%`, transform: 'translate(-50%, -50%)' }}
        animate={{ boxShadow: ["0 0 0px #eab308", "0 0 25px #eab308", "0 0 0px #eab308"] }}
        transition={{ duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: loopDelay }}
      />

      {/* 3. RM -> NMs Allocation */}
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_1} color="yellow" delay={3} duration={1.5} repeatDelay={loopDelay} />
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} color="yellow" delay={3.1} duration={1.5} repeatDelay={loopDelay} />
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} color="yellow" delay={3.2} duration={1.5} repeatDelay={loopDelay} />

      {/* 4. Containers */}
      {[POSITIONS.DATANODE_1, POSITIONS.DATANODE_2, POSITIONS.DATANODE_3].map((pos, i) => (
        <React.Fragment key={`container-group-${i}`}>
          <motion.div
            className="absolute w-6 h-6 bg-green-600/20 rounded border border-green-500/50 z-30 flex items-center justify-center backdrop-blur-sm"
            style={{ left: `${pos.x}%`, top: `${pos.y - 10}%`, transform: 'translateX(-50%)' }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1, 0] }}
            transition={{ duration: 3, delay: 4.5, repeat: Infinity, repeatDelay: loopDelay - 1.5 }}
          >
             <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
        </React.Fragment>
      ))}
    </>
    );
  };

  const renderMapReduce = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         {/* Map Phase: Data -> MR Node */}
         <Connection from={POSITIONS.DATANODE_1} to={POSITIONS.MAPREDUCE} active={true} color="#f97316" dashed />
         <Connection from={POSITIONS.DATANODE_3} to={POSITIONS.MAPREDUCE} active={true} color="#f97316" dashed />
         
         {/* Reduce Phase: MR Node -> Data (Write) */}
         <Connection from={POSITIONS.MAPREDUCE} to={POSITIONS.DATANODE_2} active={true} color="#f97316" />
      </svg>

      {/* Map Labels */}
      <motion.div className="absolute left-[40%] top-[65%] text-[10px] text-orange-400 font-bold" animate={{ opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity }}>MAP</motion.div>
      <motion.div className="absolute left-[80%] top-[65%] text-[10px] text-orange-400 font-bold" animate={{ opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>MAP</motion.div>
      
      {/* Data Moving to Process */}
      <DataPacket from={POSITIONS.DATANODE_1} to={POSITIONS.MAPREDUCE} color="orange" delay={0.5} duration={1.5} />
      <DataPacket from={POSITIONS.DATANODE_3} to={POSITIONS.MAPREDUCE} color="orange" delay={0.8} duration={1.5} />

      {/* Processing Animation at Node */}
      <motion.div 
        className="absolute w-8 h-8 rounded-full border-2 border-orange-500 z-30"
        style={{ left: `${POSITIONS.MAPREDUCE.x}%`, top: `${POSITIONS.MAPREDUCE.y}%`, transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0], borderColor: ["#f97316", "#fb923c", "#f97316"] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 2.3 }}
      />
      
      <motion.div className="absolute text-[10px] text-red-400 font-bold" style={{ left: `${POSITIONS.MAPREDUCE.x}%`, top: `${POSITIONS.MAPREDUCE.y + 8}%`, transform: 'translate(-50%, -50%)' }} animate={{ opacity: [0,1,0] }} transition={{ duration: 2, repeat: Infinity, delay: 2 }}>REDUCE</motion.div>

      {/* Output Flow */}
      <DataPacket from={POSITIONS.MAPREDUCE} to={POSITIONS.DATANODE_2} color="red" delay={3} duration={1.5} />
    </>
  );

  const renderSpark = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
         {/* Job Submission Line */}
         <Connection from={{ x: 10, y: 25 }} to={POSITIONS.SPARK} active={true} color="#f97316" />
         
         {/* Spark -> YARN RM */}
         <Connection from={POSITIONS.SPARK} to={POSITIONS.RESOURCEMANAGER} active={true} color="#eab308" dashed />

         {/* RM -> DataNodes (Allocation) */}
         <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_1} active={true} color="#eab308" dashed />
         <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} active={true} color="#eab308" dashed />
         <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} active={true} color="#eab308" dashed />

         {/* RDD Interconnections (Horizontal flow between nodes) */}
         <motion.path
            d={`M ${POSITIONS.DATANODE_1.x} ${POSITIONS.DATANODE_1.y - 12} Q 50 40 ${POSITIONS.DATANODE_3.x} ${POSITIONS.DATANODE_3.y - 12}`}
            fill="transparent"
            stroke="#f97316"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            initial={{ strokeDashoffset: 0, opacity: 0 }}
            animate={{ strokeDashoffset: -20, opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 4.5 }} 
         />
      </svg>
      
      {/* 1. Request Arrives at Spark Master */}
      <DataPacket from={{ x: 10, y: 25 }} to={POSITIONS.SPARK} color="orange" delay={0} duration={1.5} repeat={false} />
      <motion.div 
        className="absolute text-orange-200 text-xs" 
        style={{ left: '25%', top: '22%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5 }}
      >
        JOB REQUEST
      </motion.div>

      {/* 2. Spark Master Logic Trigger */}
      <motion.div 
        className="absolute w-12 h-12 bg-orange-500/20 rounded-full z-10"
        style={{ left: `${POSITIONS.SPARK.x}%`, top: `${POSITIONS.SPARK.y}%`, transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ delay: 1.5, duration: 0.5 }}
      />

      {/* 3. Spark Requests Resources from YARN RM */}
      <DataPacket from={POSITIONS.SPARK} to={POSITIONS.RESOURCEMANAGER} color="yellow" delay={2.0} duration={1.0} repeat={false} />
      <motion.div 
        className="absolute text-[10px] text-yellow-400 font-bold" 
        style={{ left: '55%', top: '25%' }}
        initial={{ opacity: 0 }} 
        animate={{ opacity: [0, 1, 0] }} 
        transition={{ delay: 2.2, duration: 1 }}
      >
        REQUEST RESOURCES
      </motion.div>

      {/* 4. YARN RM Allocates Containers on DataNodes */}
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_1} color="yellow" delay={3.0} duration={1.0} repeat={false} />
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} color="yellow" delay={3.0} duration={1.0} repeat={false} />
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} color="yellow" delay={3.0} duration={1.0} repeat={false} />

      {/* 5. In-Memory Processing Activation (Executors Start) */}
      <motion.div className="absolute text-orange-500 font-bold text-sm tracking-widest uppercase" style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.5 }}>Spark In-Memory</motion.div>

      {[POSITIONS.DATANODE_1, POSITIONS.DATANODE_2, POSITIONS.DATANODE_3].map((pos, i) => (
        <React.Fragment key={`spark-executor-${i}`}>
          {/* Connector Beam (indicating active executor) */}
          <motion.div 
            className="absolute w-0.5 bg-gradient-to-t from-slate-700 to-orange-500/50" 
            style={{ left: `${pos.x}%`, top: `${pos.y - 8}%`, transform: 'translate(-50%, -50%)' }} 
            initial={{ height: 0 }}
            animate={{ height: '6rem' }}
            transition={{ delay: 4.5 }}
          />
          {/* Executor Box */}
          <motion.div
            className="absolute w-10 h-8 bg-slate-800/90 border border-orange-500 rounded-lg flex items-center justify-center overflow-hidden z-20"
            style={{ left: `${pos.x}%`, top: `${pos.y - 14}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 4.5 + i * 0.1 }}
          >
             <div className="flex space-x-0.5 h-full items-center">
                {[1, 2, 3].map(bit => (
                  <motion.div key={bit} className="w-0.5 bg-orange-400/80 rounded-full" initial={{ height: '20%' }} animate={{ height: ['20%', '80%', '20%'] }} transition={{ duration: 0.6, repeat: Infinity, delay: 5.0 + bit * 0.2 }} />
                ))}
             </div>
          </motion.div>
        </React.Fragment>
      ))}
    </>
  );

  const renderMahout = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Job Input Line */}
        <Connection from={{ x: 10, y: 40 }} to={POSITIONS.MAHOUT} active={true} color="#ec4899" />
        
        {/* Mahout -> RM */}
        <Connection from={POSITIONS.MAHOUT} to={POSITIONS.RESOURCEMANAGER} active={true} color="#ec4899" dashed />
        
        {/* RM -> HDFS (DataNodes) */}
        <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} active={true} color="#eab308" dashed />
        <Connection from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} active={true} color="#eab308" dashed />
      </svg>

      {/* 1. Job Input */}
      <DataPacket from={{ x: 10, y: 40 }} to={POSITIONS.MAHOUT} color="pink" delay={0} duration={1.5} repeat={false} />
      <motion.div 
        className="absolute text-[10px] text-pink-300 font-bold" 
        style={{ left: '20%', top: '42%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5 }}
      >
        ML JOB
      </motion.div>

      {/* 2. Request Resource (Mahout -> RM) */}
      <DataPacket from={POSITIONS.MAHOUT} to={POSITIONS.RESOURCEMANAGER} color="pink" delay={1.5} duration={1} repeat={false} />

      {/* 3. RM Allocates on HDFS */}
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_2} color="yellow" delay={2.5} duration={1} />
      <DataPacket from={POSITIONS.RESOURCEMANAGER} to={POSITIONS.DATANODE_3} color="yellow" delay={2.7} duration={1} />

      {/* 4. Processing Animation */}
      <motion.div 
        className="absolute z-30"
        style={{ left: `${POSITIONS.MAHOUT.x}%`, top: `${POSITIONS.MAHOUT.y}%`, transform: 'translate(-50%, -50%)' }}
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 3.5 }}
      >
        <div className="w-12 h-12 border-2 border-dashed border-pink-500 rounded-full opacity-50"></div>
      </motion.div>
      <motion.div 
        className="absolute text-[10px] text-pink-300 font-mono bg-black/60 px-2 rounded" 
        style={{ left: '65%', top: '35%' }} 
        animate={{ opacity: [0,1,0] }} 
        transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
      >
        Model Training...
      </motion.div>
    </>
  );

  const renderQuery = () => (
    <>
       <DataPacket from={POSITIONS.HIVE} to={POSITIONS.RESOURCEMANAGER} color="pink" delay={0} />
       <DataPacket from={POSITIONS.PIG} to={POSITIONS.RESOURCEMANAGER} color="pink" delay={0.5} />
       <motion.div className="absolute text-[10px] text-pink-400 font-mono bg-black/50 p-1 rounded" style={{ left: '75%', top: '25%' }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }}>SELECT * ...</motion.div>
    </>
  );

  const renderHBase = () => (
    <>
       <DataPacket from={POSITIONS.HBASE} to={POSITIONS.DATANODE_3} color="indigo" delay={0} />
       <motion.div className="absolute border border-indigo-500 rounded-full w-20 h-20" style={{ left: `${POSITIONS.HBASE.x}%`, top: `${POSITIONS.HBASE.y}%`, transform: 'translate(-50%, -50%)' }} animate={{ borderColor: ['#6366f1', '#a5b4fc', '#6366f1'], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    </>
  );

  const renderSolr = () => (
    <>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         <Connection from={POSITIONS.DATANODE_3} to={POSITIONS.SOLR} active={true} color="#14b8a6" dashed />
         <Connection from={POSITIONS.HBASE} to={POSITIONS.SOLR} active={true} color="#14b8a6" dashed />
      </svg>

      {/* Indexing Flow */}
      <DataPacket from={POSITIONS.DATANODE_3} to={POSITIONS.SOLR} color="teal" delay={0} />
      <DataPacket from={POSITIONS.HBASE} to={POSITIONS.SOLR} color="teal" delay={1} />

      {/* Indexing Animation */}
      <motion.div className="absolute text-teal-400" style={{ left: `${POSITIONS.SOLR.x}%`, top: `${POSITIONS.SOLR.y - 10}%` }} animate={{ y: [0, -5, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <FileText size={16} />
      </motion.div>
    </>
  );

  const renderOozie = () => (
    <>
       <motion.circle cx={POSITIONS.ZOOKEEPER.x + "%"} cy={POSITIONS.ZOOKEEPER.y + "%"} r="35" stroke="#10b981" strokeWidth="0.5" fill="none" animate={{ scale: [1, 1.2], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
       
       {/* Coordination Lines */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Connection from={POSITIONS.OOZIE} to={POSITIONS.FLUME} active={true} color="white" dashed />
          <Connection from={POSITIONS.OOZIE} to={POSITIONS.HIVE} active={true} color="white" dashed />
          <Connection from={POSITIONS.OOZIE} to={POSITIONS.SPARK} active={true} color="white" dashed />
       </svg>
       
       <DataPacket from={POSITIONS.OOZIE} to={POSITIONS.FLUME} color="white" delay={0} />
       <DataPacket from={POSITIONS.OOZIE} to={POSITIONS.HIVE} color="white" delay={1} />
    </>
  );

  const renderAmbari = () => (
    <>
      {/* Ambari scanning the cluster */}
      <motion.div
        className="absolute border-2 border-green-500 rounded-full"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: '90%', height: '90%', opacity: 0 }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Health Checks on Nodes */}
      {[POSITIONS.NAMENODE, POSITIONS.RESOURCEMANAGER, POSITIONS.DATANODE_1, POSITIONS.DATANODE_2, POSITIONS.KAFKA].map((pos, i) => (
         <motion.div 
           key={i}
           className="absolute w-3 h-3 bg-green-500 rounded-full z-40"
           style={{ left: `${pos.x + 3}%`, top: `${pos.y - 3}%` }}
           animate={{ scale: [0, 1, 0] }}
           transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
         />
      ))}

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
         <Connection from={POSITIONS.AMBARI} to={POSITIONS.NAMENODE} active={true} color="#10b981" dashed />
         <Connection from={POSITIONS.AMBARI} to={POSITIONS.RESOURCEMANAGER} active={true} color="#10b981" dashed />
      </svg>
    </>
  );

  // Background Infrastructure Lines
  const renderInfrastructure = () => {
    const color = "#1e293b";
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Core HDFS/YARN Spine */}
        <line x1={POSITIONS.NAMENODE.x} y1={POSITIONS.NAMENODE.y} x2={POSITIONS.DATANODE_1.x} y2={POSITIONS.DATANODE_1.y} stroke={color} strokeWidth="0.5" />
        <line x1={POSITIONS.NAMENODE.x} y1={POSITIONS.NAMENODE.y} x2={POSITIONS.DATANODE_3.x} y2={POSITIONS.DATANODE_3.y} stroke={color} strokeWidth="0.5" />
        <line x1={POSITIONS.RESOURCEMANAGER.x} y1={POSITIONS.RESOURCEMANAGER.y} x2={POSITIONS.DATANODE_2.x} y2={POSITIONS.DATANODE_2.y} stroke={color} strokeWidth="0.5" />
      </svg>
    );
  };

  const isStepActive = (targetStep: FlowStep) => {
    if (step === FlowStep.SUMMARY) return true;
    return step === targetStep;
  };

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {renderInfrastructure()}

      <AnimatePresence>
        {step === FlowStep.INGESTION && renderIngestion()}
        {step === FlowStep.STREAMING && renderStreaming()}
        {step === FlowStep.STORAGE_HDFS && renderHDFS()}
        {step === FlowStep.RESOURCE_YARN && renderYARN()}
        {step === FlowStep.PROCESSING_MR && renderMapReduce()}
        {step === FlowStep.PROCESSING_SPARK && renderSpark()}
        {step === FlowStep.ML_MAHOUT && renderMahout()}
        {step === FlowStep.QUERY_HIVE_PIG && renderQuery()}
        {step === FlowStep.NOSQL_HBASE && renderHBase()}
        {step === FlowStep.SEARCH_SOLR && renderSolr()}
        {step === FlowStep.WORKFLOW_OOZIE && renderOozie()}
        {step === FlowStep.MANAGEMENT_AMBARI && renderAmbari()}
        {step === FlowStep.SUMMARY && (
          <>
            {renderIngestion()}
            {renderHDFS()}
          </>
        )}
      </AnimatePresence>

      {/* --- NODES --- */}

      {/* Sources */}
      <NodeIcon icon={FileText} {...POSITIONS.SOURCE_LOGS} label="Logs" color="blue" active={step === FlowStep.INGESTION || step === FlowStep.SUMMARY} />
      <NodeIcon icon={MessageCircle} {...POSITIONS.SOURCE_STREAM} label="Stream" color="purple" active={step === FlowStep.STREAMING || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Database} {...POSITIONS.SOURCE_DB} label="DB" color="green" active={step === FlowStep.INGESTION || step === FlowStep.SUMMARY} />

      {/* Ingestion */}
      <NodeIcon icon={Share2} {...POSITIONS.FLUME} label="Flume" color="blue" active={step === FlowStep.INGESTION || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Zap} {...POSITIONS.STORM} label="Storm" color="yellow" active={step === FlowStep.STREAMING || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Layers} {...POSITIONS.KAFKA} label="Kafka" color="purple" active={step === FlowStep.STREAMING || step === FlowStep.SUMMARY} />
      <NodeIcon icon={GitBranch} {...POSITIONS.SQOOP} label="Sqoop" color="green" active={step === FlowStep.INGESTION || step === FlowStep.SUMMARY} />

      {/* Masters */}
      <NodeIcon icon={Eye} {...POSITIONS.ZOOKEEPER} label="ZooKeeper" color="emerald" active={step === FlowStep.STREAMING || step === FlowStep.WORKFLOW_OOZIE || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Settings} {...POSITIONS.NAMENODE} label="NameNode" color="cyan" active={step === FlowStep.STORAGE_HDFS || step === FlowStep.INGESTION || step === FlowStep.SUMMARY} />
      <NodeIcon 
        icon={Activity} 
        {...POSITIONS.RESOURCEMANAGER} 
        label="Res.Manager" 
        color="yellow" 
        active={
          step === FlowStep.RESOURCE_YARN || 
          step === FlowStep.PROCESSING_SPARK || 
          step === FlowStep.ML_MAHOUT || 
          step === FlowStep.QUERY_HIVE_PIG || 
          step === FlowStep.SUMMARY
        } 
      />
      <NodeIcon icon={Monitor} {...POSITIONS.AMBARI} label="Ambari" color="emerald" active={step === FlowStep.MANAGEMENT_AMBARI || step === FlowStep.SUMMARY} />

      {/* Workflow */}
      <NodeIcon icon={GitBranch} {...POSITIONS.OOZIE} label="Oozie" color="white" active={step === FlowStep.WORKFLOW_OOZIE} />

      {/* Slaves */}
      <NodeIcon icon={Server} {...POSITIONS.DATANODE_1} label="DataNode 1" color="cyan" active={step >= FlowStep.STORAGE_HDFS} />
      <NodeIcon icon={Server} {...POSITIONS.DATANODE_2} label="DataNode 2" color="cyan" active={step >= FlowStep.STORAGE_HDFS} />
      <NodeIcon icon={Server} {...POSITIONS.DATANODE_3} label="DataNode 3" color="cyan" active={step >= FlowStep.STORAGE_HDFS} />

      {/* Processing / Query */}
      <NodeIcon icon={Box} {...POSITIONS.MAPREDUCE} label="MapReduce" color="orange" active={step === FlowStep.PROCESSING_MR || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Table} {...POSITIONS.HIVE} label="Hive" color="pink" active={step === FlowStep.QUERY_HIVE_PIG || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Cpu} {...POSITIONS.PIG} label="Pig" color="pink" active={step === FlowStep.QUERY_HIVE_PIG} />
      <NodeIcon icon={Zap} {...POSITIONS.SPARK} label="Spark" color="orange" active={step === FlowStep.PROCESSING_SPARK || step === FlowStep.ML_MAHOUT || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Brain} {...POSITIONS.MAHOUT} label="Mahout" color="pink" active={step === FlowStep.ML_MAHOUT || step === FlowStep.SUMMARY} />

      {/* Storage/Index */}
      <NodeIcon icon={Layers} {...POSITIONS.HBASE} label="HBase" color="indigo" active={step === FlowStep.NOSQL_HBASE || step === FlowStep.SEARCH_SOLR || step === FlowStep.SUMMARY} />
      <NodeIcon icon={Search} {...POSITIONS.SOLR} label="Solr" subLabel="Solr + Lucene" color="teal" active={step === FlowStep.SEARCH_SOLR || step === FlowStep.SUMMARY} />

    </div>
  );
};

export default SimulationCanvas;
