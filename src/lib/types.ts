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

export interface SJob {
	batch_host: string;
	cluster: string;
	command: string;
	group_id: number;
	group_name: string;
	job_id: number;
	job_state: string[];
	name: string;
	start_time: {
		number: number;
	};
	tres_req_str: string;
	tres_alloc_str: string;
	user_id: number;
	user_name: string;
	current_working_directory: string;
}

export interface DBJob {
	cluster: string;
	time: {
		elapsed: number;
		eligible: number;
		end: number;
		start: number;
		submission: number;
		suspended: number;
	};
	group: string;
	job_id: number;
	name: number;
	nodes: string;
	partition: string;
	hold: boolean;
	priority: {
		set: boolean;
		infinite: boolean;
		number: number;
	};
	required: {
		CPUs: number;
		memory_per_cpu: {
			set: boolean;
			infinite: boolean;
			number: number;
		};
		memory_per_node: {
			set: boolean;
			infinite: boolean;
			number: number;
		};
	};
	kill_request_user: string;
	state: {
		current: string[];
	};
	submit_line: string;
	tres: {
		allocated: [];
		requested: {
			type: string;
			name: string;
			id: number;
			count: number;
		}[];
	};
	user: string;
	working_directory: string;
}
