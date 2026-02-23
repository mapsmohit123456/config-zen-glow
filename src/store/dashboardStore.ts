import { create } from 'zustand';

export interface StageData {
  stage: number;
  original_quantity: number;
  remaining_quantity: number;
  entry_price: number;
  executed_at?: string;
}

export interface Position {
  status: 'active' | 'exiting' | 'completed';
  instrument?: string;
  brand?: string;
  option_type?: string;
  strike?: number;
  entry_price?: number;
  current_price?: number;
  target_price?: number;
  highest_premium?: number;
  trailing_active?: boolean;
  trailing_sl?: number;
  executed_75_percent?: boolean;
  stages?: StageData[];
  total_original_quantity?: number;
  planned_stage_quantities?: number[];
  premium_pricing?: string;
}

export interface Config {
  csv_path: string;
  poll_interval: number;
  ltp_monitor_interval: number;
  max_positions: number;
  auto_execute: boolean;
  base_capital_allocation: { NIFTY: number; BANKNIFTY: number };
  capital_reduction_overpriced: number;
  profit_targets: { fair: number; overpriced: number };
  exit_strategy: {
    profit_target_percent: number;
    immediate_exit_percent: number;
    trailing_exit_percent: number;
    trailing_config: {
      profit_lock_percent: { fair: number; overpriced: number };
      min_trail_distance: number;
    };
  };
  stop_loss: { enabled: boolean; offset: number };
  itm_offset: number;
  expiry_day: { NIFTY: number | string; BANKNIFTY: number | string };
  lot_size: { NIFTY: number; BANKNIFTY: number };
  strike_interval: { NIFTY: number; BANKNIFTY: number };
  manual_strike: { NIFTY: number | null; BANKNIFTY: number | null };
  manual_expiry: { NIFTY: string; BANKNIFTY: string };
  pyramid_stages: number[];
  market_observation?: {
    observation_value: number;
    next_day_sentiment: string;
    hurdle_point: number;
    pre_open_range: { low: number; high: number };
  };
}

export interface LogEntry {
  msg: string;
  type: 'info' | 'success' | 'warn' | 'error';
  time: string;
}

interface DashboardState {
  page: string;
  sidebarCollapsed: boolean;
  config: Config;
  positions: { positions: Record<string, Position>; pending: Record<string, any> };
  logs: LogEntry[];
  live: boolean;
  cfgDirty: boolean;
  startTime: number;

  setPage: (page: string) => void;
  toggleSidebar: () => void;
  setConfig: (config: Config) => void;
  updateConfig: (partial: Partial<Config>) => void;
  setCfgDirty: (dirty: boolean) => void;
  addLog: (msg: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

const defaultConfig: Config = {
  csv_path: "tv_data.csv",
  poll_interval: 5,
  ltp_monitor_interval: 2,
  max_positions: 1,
  auto_execute: true,
  base_capital_allocation: { NIFTY: 100000, BANKNIFTY: 50000 },
  capital_reduction_overpriced: 0.7,
  profit_targets: { fair: 30, overpriced: 15 },
  exit_strategy: {
    profit_target_percent: 30,
    immediate_exit_percent: 75,
    trailing_exit_percent: 25,
    trailing_config: {
      profit_lock_percent: { fair: 45, overpriced: 60 },
      min_trail_distance: 2.0,
    },
  },
  stop_loss: { enabled: true, offset: 25 },
  itm_offset: 100,
  expiry_day: { NIFTY: 1, BANKNIFTY: "last_tuesday" },
  lot_size: { NIFTY: 25, BANKNIFTY: 15 },
  strike_interval: { NIFTY: 50, BANKNIFTY: 100 },
  manual_strike: { NIFTY: null, BANKNIFTY: null },
  manual_expiry: { NIFTY: "", BANKNIFTY: "" },
  pyramid_stages: [15, 30, 55],
};

export const useDashboardStore = create<DashboardState>((set) => ({
  page: 'dashboard',
  sidebarCollapsed: false,
  config: defaultConfig,
  positions: { positions: {}, pending: {} },
  logs: [{ msg: 'PyraBot Pro Dashboard started — connecting to server…', type: 'info', time: new Date().toLocaleTimeString('en-IN') }],
  live: false,
  cfgDirty: false,
  startTime: Date.now(),

  setPage: (page) => set({ page }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setConfig: (config) => set({ config }),
  updateConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial }, cfgDirty: true })),
  setCfgDirty: (dirty) => set({ cfgDirty: dirty }),
  addLog: (msg, type = 'info') =>
    set((s) => ({
      logs: [
        { msg, type, time: new Date().toLocaleTimeString('en-IN') },
        ...s.logs.slice(0, 199),
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));
