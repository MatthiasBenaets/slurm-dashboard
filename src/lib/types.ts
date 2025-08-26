export interface Tres {
	type: string;
	count: number;
}

export interface NodeState {
	IDLE: number;
	MIXED: number;
	ALLOCATED: number;
	DOWN: number;
	DRAIN: number;
	UNKNOWN: number;
}

export interface Node {
	address: string;
	alloc_cpus: number;
	alloc_idle_cpus: number;
	alloc_memory: number;
	architecture: string;
	cluster_name: string;
	cores: number;
	cpus: number;
	cpu_binding: number;
	cpu_load: number;
	effective_cpus: number;
	hostname: string;
	partitions: string[];
	real_memory: number;
	reason: string;
	sockets: number;
	state: string[];
	threads: number;
	tres: string;
	tres_used: string;
	weight: number;
}

export interface Partition {
	cluster: string;
	cpus: { task_binding: number; total: number };
	name: string;
	nodes: string[];
	node_sets: string;
	state: { allowed_allocation: string; configured: string; total: number };
	partition: { state: string[] };
	priority: { job_factor: number; tier: number };
	tres: { billing_weights: string; configured: string };
	lenght: number;
}
