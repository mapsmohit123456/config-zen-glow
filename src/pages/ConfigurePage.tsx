import { useState, useRef } from 'react';
import DashCard from '@/components/dashboard/DashCard';
import { useDashboardStore } from '@/store/dashboardStore';
import { toast } from 'sonner';

const ConfigurePage = () => {
  const { config, updateConfig, setCfgDirty, cfgDirty, addLog } = useDashboardStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [csvWarning, setCsvWarning] = useState('');
  const [foundCsvs, setFoundCsvs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
    setCfgDirty(true);
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setLocalConfig((prev) => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [field]: value },
    }));
    setCfgDirty(true);
  };

  // CSV FILE PICKER - Fixed to handle full path
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    // Browser security prevents accessing full path.
    // We set the filename and prompt user to type full path.
    setLocalConfig((prev) => ({ ...prev, csv_path: file.name }));
    setCfgDirty(true);
    setCsvWarning(
      `⚠ Browser security hides the full file path. The filename "${file.name}" has been set. ` +
      `Please type the COMPLETE path in the field above (e.g., C:\\Users\\you\\data\\${file.name} or /home/you/data/${file.name}) ` +
      `to ensure the bot can locate the file on your system.`
    );
    toast.info(`📄 Selected: ${file.name} — Please verify the full path`);
    setFoundCsvs([]);
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const csvFiles = files.filter((f) => f.name.endsWith('.csv'));
    const folder = (files[0]?.webkitRelativePath || '').split('/')[0];

    if (csvFiles.length === 0) {
      toast.warning('No CSV files found in folder');
      return;
    }

    // Use webkitRelativePath which gives relative path from selected folder
    const firstCsv = csvFiles[0];
    const relativePath = firstCsv.webkitRelativePath || firstCsv.name;
    
    setLocalConfig((prev) => ({ ...prev, csv_path: relativePath }));
    setCfgDirty(true);
    setFoundCsvs(csvFiles.map((f) => f.webkitRelativePath || f.name));
    setCsvWarning(
      `📁 Found ${csvFiles.length} CSV file(s) in "${folder}". ` +
      `The relative path "${relativePath}" has been set. ` +
      `If your bot runs from a different directory, please edit the path to be absolute ` +
      `(e.g., C:\\Users\\you\\${relativePath} or /home/you/${relativePath}).`
    );
    toast.success(`📁 ${csvFiles.length} CSV(s) found in "${folder}"`);
  };

  const handleCsvChipClick = (path: string) => {
    setLocalConfig((prev) => ({ ...prev, csv_path: path }));
    setCfgDirty(true);
    toast.success(`📄 ${path}`);
  };

  const handleSave = () => {
    updateConfig(localConfig);
    setCfgDirty(false);
    addLog('Configuration saved — all fields updated', 'success');
    toast.success('✅ Configuration saved to config.json');
  };

  const handleDiscard = () => {
    setLocalConfig(config);
    setCfgDirty(false);
    setCsvWarning('');
    setFoundCsvs([]);
    toast.warning('↺ Changes discarded');
  };

  const es = localConfig.exit_strategy;
  const sl = localConfig.stop_loss;

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-5">
      {/* Left: Form */}
      <div className="flex flex-col gap-4">
        {/* CSV & Monitoring */}
        <DashCard title="▦ CSV & Monitoring">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">CSV File Path</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={localConfig.csv_path}
                  onChange={(e) => { handleChange('csv_path', e.target.value); setCsvWarning(''); }}
                  placeholder="/full/path/to/tv_data.csv or C:\Users\you\tv_data.csv"
                  className="flex-1 px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 h-[38px] px-3 bg-accent border border-border text-t2 text-[11px] font-semibold rounded-lg hover:border-primary/30 hover:text-primary transition-all whitespace-nowrap"
                >
                  📄 File
                </button>
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="flex-shrink-0 h-[38px] px-3 bg-accent border border-border text-t2 text-[11px] font-semibold rounded-lg hover:border-primary/30 hover:text-primary transition-all whitespace-nowrap"
                >
                  📁 Folder
                </button>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                <input ref={folderInputRef} type="file" {...{ webkitdirectory: '', directory: '' } as any} className="hidden" onChange={handleFolderSelect} />
              </div>

              {/* CSV warning/info message */}
              {csvWarning && (
                <div className="mt-2 p-3 bg-amber/5 border border-amber/20 rounded-lg text-[11px] text-amber leading-relaxed">
                  {csvWarning}
                </div>
              )}

              {/* Found CSV chips */}
              {foundCsvs.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {foundCsvs.map((csv) => (
                    <button
                      key={csv}
                      onClick={() => handleCsvChipClick(csv)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-mono border transition-all ${
                        localConfig.csv_path === csv
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-accent border-border text-t2 hover:border-primary/30 hover:text-primary'
                      }`}
                    >
                      {csv}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-t3 mt-1.5">
                💡 <strong>Tip:</strong> Type the full absolute path directly for best results. The file/folder buttons help you find the filename, but browsers cannot access the full system path. After selecting, edit the path to include the complete directory.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-t2 mb-1.5 block">Poll Interval (sec)</label>
                <input type="number" min={1} value={localConfig.poll_interval} onChange={(e) => handleChange('poll_interval', +e.target.value)}
                  className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-t2 mb-1.5 block">LTP Monitor Interval (sec)</label>
                <input type="number" min={1} value={localConfig.ltp_monitor_interval} onChange={(e) => handleChange('ltp_monitor_interval', +e.target.value)}
                  className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-t2 mb-1.5 block">Max Positions</label>
                <input type="number" min={1} max={5} value={localConfig.max_positions} onChange={(e) => handleChange('max_positions', +e.target.value)}
                  className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-t2 mb-1.5 block">Auto Execute</label>
                <select value={localConfig.auto_execute ? 'true' : 'false'} onChange={(e) => handleChange('auto_execute', e.target.value === 'true')}
                  className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                  <option value="true">✅ Enabled (Live)</option>
                  <option value="false">🔵 Manual Mode</option>
                </select>
              </div>
            </div>
          </div>
        </DashCard>

        {/* Capital Allocation */}
        <DashCard title="💰 Capital Allocation">
          <div className="bg-amber/5 border border-amber/20 rounded-lg p-3 mb-4 text-[11px] text-amber">
            ⚠ If available capital is below Stage 1 requirement, Stage 1 executes with <strong>1 lot minimum</strong> — Stages 2 & 3 pause.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">NIFTY Base Capital (₹)</label>
              <input type="number" step={10000} value={localConfig.base_capital_allocation.NIFTY} onChange={(e) => handleNestedChange('base_capital_allocation', 'NIFTY', +e.target.value)}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">BANKNIFTY Base Capital (₹)</label>
              <input type="number" step={10000} value={localConfig.base_capital_allocation.BANKNIFTY} onChange={(e) => handleNestedChange('base_capital_allocation', 'BANKNIFTY', +e.target.value)}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold text-t2 mb-1.5 block">Capital Reduction — Overpriced <span className="text-t3 font-normal">(fraction)</span></label>
            <input type="number" step={0.05} min={0.1} max={1} value={localConfig.capital_reduction_overpriced} onChange={(e) => handleChange('capital_reduction_overpriced', +e.target.value)}
              className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            <div className="text-[10px] text-t3 mt-1">0.7 = use 70% of base capital when premium is overpriced</div>
          </div>
        </DashCard>

        {/* Profit Targets */}
        <DashCard title="🎯 Profit Targets">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">Fair Premium Target (%)</label>
              <input type="number" step={5} value={localConfig.profit_targets.fair} onChange={(e) => handleNestedChange('profit_targets', 'fair', +e.target.value)}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">Overpriced Target (%)</label>
              <input type="number" step={5} value={localConfig.profit_targets.overpriced} onChange={(e) => handleNestedChange('profit_targets', 'overpriced', +e.target.value)}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
          </div>
        </DashCard>

        {/* Exit Strategy */}
        <DashCard title="📤 Exit Strategy" chip={{ text: 'v3.3', color: 'cyan' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-accent/40 rounded-lg p-3 text-center">
              <div className="text-[9px] tracking-[1.2px] uppercase text-t3 mb-1">Immediate Exit</div>
              <div className="font-display text-xl font-black text-green-bright">{es.immediate_exit_percent}%</div>
              <div className="text-[10px] text-t2">at target price</div>
            </div>
            <div className="bg-accent/40 rounded-lg p-3 text-center">
              <div className="text-[9px] tracking-[1.2px] uppercase text-t3 mb-1">Trailing Stop</div>
              <div className="font-display text-xl font-black text-purple">{es.trailing_exit_percent}%</div>
              <div className="text-[10px] text-t2">with profit lock</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">Immediate Exit (%)</label>
              <input type="number" min={0} max={100} step={5} value={es.immediate_exit_percent}
                onChange={(e) => {
                  const imm = +e.target.value;
                  setLocalConfig((prev) => ({
                    ...prev,
                    exit_strategy: { ...prev.exit_strategy, immediate_exit_percent: imm, trailing_exit_percent: 100 - imm },
                  }));
                  setCfgDirty(true);
                }}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-t2 mb-1.5 block">Trailing Exit (%)</label>
              <input type="number" min={0} max={100} step={5} value={es.trailing_exit_percent} readOnly
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-t3 text-[13px] font-mono outline-none" />
              <div className="text-[10px] text-t3 mt-1">Must sum to 100%</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-green-bright mb-1.5 block">✅ Fair Premium Lock (%)</label>
              <input type="number" step={5} value={es.trailing_config.profit_lock_percent.fair}
                onChange={(e) => setLocalConfig((prev) => ({
                  ...prev,
                  exit_strategy: { ...prev.exit_strategy, trailing_config: { ...prev.exit_strategy.trailing_config, profit_lock_percent: { ...prev.exit_strategy.trailing_config.profit_lock_percent, fair: +e.target.value } } },
                }))}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              <div className="text-[10px] text-t3 mt-1">Looser trail → captures bigger moves</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-amber mb-1.5 block">⚠ Overpriced Lock (%)</label>
              <input type="number" step={5} value={es.trailing_config.profit_lock_percent.overpriced}
                onChange={(e) => setLocalConfig((prev) => ({
                  ...prev,
                  exit_strategy: { ...prev.exit_strategy, trailing_config: { ...prev.exit_strategy.trailing_config, profit_lock_percent: { ...prev.exit_strategy.trailing_config.profit_lock_percent, overpriced: +e.target.value } } },
                }))}
                className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              <div className="text-[10px] text-t3 mt-1">Tighter trail → protects from reversals</div>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold text-t2 mb-1.5 block">Min Trail Distance (₹)</label>
            <input type="number" step={0.5} min={0} value={es.trailing_config.min_trail_distance}
              onChange={(e) => setLocalConfig((prev) => ({
                ...prev,
                exit_strategy: { ...prev.exit_strategy, trailing_config: { ...prev.exit_strategy.trailing_config, min_trail_distance: +e.target.value } },
              }))}
              className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            <div className="text-[10px] text-t3 mt-1">Reduces log spam on small price moves</div>
          </div>
        </DashCard>

        {/* Stop Loss */}
        <DashCard title="🛑 Stop Loss">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-t2">{sl.enabled ? 'Enabled' : 'Disabled'}</span>
            <button
              onClick={() => {
                setLocalConfig((prev) => ({ ...prev, stop_loss: { ...prev.stop_loss, enabled: !prev.stop_loss.enabled } }));
                setCfgDirty(true);
              }}
              className={`w-[34px] h-[18px] rounded-full relative transition-colors cursor-pointer ${sl.enabled ? 'bg-green' : 'bg-border'}`}
            >
              <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-card shadow-sm transition-all ${sl.enabled ? 'left-[18px]' : 'left-[2px]'}`} />
            </button>
          </div>
          <div className="bg-red/5 border border-red/20 rounded-lg p-3 mb-3 text-[11px] text-t2">
            Triggers when <strong className="text-foreground">Spot ≤ Condition_Price − Offset</strong>. Closes ALL positions immediately.
          </div>
          <div>
            <label className="text-xs font-semibold text-t2 mb-1.5 block">SL Offset (points below Condition_Price)</label>
            <input type="number" step={5} min={0} value={sl.offset} onChange={(e) => setLocalConfig((prev) => ({ ...prev, stop_loss: { ...prev.stop_loss, offset: +e.target.value } }))}
              className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            <div className="text-[10px] text-t3 mt-1">CSV must include a <code className="font-mono text-primary">Condition_Price</code> column</div>
          </div>
        </DashCard>

        {/* Strike, Expiry & NSE Params */}
        <DashCard title="📐 Strike, Expiry & NSE Params">
          <div>
            <label className="text-xs font-semibold text-t2 mb-1.5 block">ITM Offset (points)</label>
            <input type="number" step={50} value={localConfig.itm_offset} onChange={(e) => handleChange('itm_offset', +e.target.value)}
              className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
            <div className="text-[10px] text-t3 mt-1">CE: ATM − offset · PE: ATM + offset</div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <div className="text-[11px] font-bold text-t2 mb-2.5">NIFTY Parameters</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Expiry Day</label>
                  <select value={localConfig.expiry_day.NIFTY} onChange={(e) => handleNestedChange('expiry_day', 'NIFTY', isNaN(+e.target.value) ? e.target.value : +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((d,i) => <option key={d} value={i}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Lot Size</label>
                  <input type="number" min={1} value={localConfig.lot_size.NIFTY} onChange={(e) => handleNestedChange('lot_size', 'NIFTY', +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Strike Interval (pts)</label>
                  <input type="number" step={50} value={localConfig.strike_interval.NIFTY} onChange={(e) => handleNestedChange('strike_interval', 'NIFTY', +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-t2 mb-2.5">BANKNIFTY Parameters</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Expiry Day</label>
                  <select value={localConfig.expiry_day.BANKNIFTY} onChange={(e) => handleNestedChange('expiry_day', 'BANKNIFTY', isNaN(+e.target.value) ? e.target.value : +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday'].map((d,i) => <option key={d} value={i}>{d}</option>)}
                    <option value="last_tuesday">Last Tuesday (Monthly)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Lot Size</label>
                  <input type="number" min={1} value={localConfig.lot_size.BANKNIFTY} onChange={(e) => handleNestedChange('lot_size', 'BANKNIFTY', +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-t2 mb-1.5 block">Strike Interval (pts)</label>
                  <input type="number" step={50} value={localConfig.strike_interval.BANKNIFTY} onChange={(e) => handleNestedChange('strike_interval', 'BANKNIFTY', +e.target.value)}
                    className="w-full px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Manual Override */}
          <div className="bg-accent/40 border border-border rounded-lg p-4 mt-4">
            <div className="text-[11px] font-bold text-t2 mb-2">🔧 Manual Strike & Expiry Override</div>
            <div className="text-[10px] text-t3 mb-3">Leave blank for automatic calculation</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-t2 mb-1 block">NIFTY Strike</label>
                <input type="number" placeholder="e.g. 25700" value={localConfig.manual_strike.NIFTY || ''} onChange={(e) => handleNestedChange('manual_strike', 'NIFTY', +e.target.value || null)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-t2 mb-1 block">BANKNIFTY Strike</label>
                <input type="number" placeholder="e.g. 51100" value={localConfig.manual_strike.BANKNIFTY || ''} onChange={(e) => handleNestedChange('manual_strike', 'BANKNIFTY', +e.target.value || null)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-t2 mb-1 block">NIFTY Expiry</label>
                <input type="date" value={localConfig.manual_expiry.NIFTY} onChange={(e) => handleNestedChange('manual_expiry', 'NIFTY', e.target.value)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-t2 mb-1 block">BANKNIFTY Expiry</label>
                <input type="date" value={localConfig.manual_expiry.BANKNIFTY} onChange={(e) => handleNestedChange('manual_expiry', 'BANKNIFTY', e.target.value)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
              </div>
            </div>
          </div>
        </DashCard>

        {/* Unsaved banner + Save */}
        {cfgDirty && (
          <div className="flex items-center justify-between bg-amber/5 border border-amber/20 rounded-lg p-3 text-[11px] text-amber">
            <span>⚠ Unsaved changes</span>
            <button onClick={handleDiscard} className="text-amber font-semibold hover:underline">↺ Discard</button>
          </div>
        )}
        <button onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-primary to-cyan text-primary-foreground font-display text-[13px] font-bold rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all tracking-wide">
          💾 Save All Configuration to config.json
        </button>
        <button onClick={handleDiscard} className="w-full py-2.5 bg-transparent text-t2 border border-border rounded-lg text-xs font-semibold hover:border-red/30 hover:text-red transition-all">
          ↺ Reset to Last Saved
        </button>
      </div>

      {/* Right: Reference Cards */}
      <div className="flex flex-col gap-4">
        <DashCard>
          <div className="font-display text-[15px] font-bold mb-3">▲ Pyramid Structure</div>
          <div className="flex flex-col items-center gap-1 py-2.5">
            <div className="w-[80%] bg-green text-primary-foreground rounded-lg py-2.5 text-center text-[11px] font-bold shadow-md">55% — Stage 3</div>
            <div className="w-[55%] bg-cyan text-primary-foreground rounded-lg py-2 text-center text-[11px] font-bold shadow-md">30% — Stage 2</div>
            <div className="w-[35%] bg-purple text-primary-foreground rounded-lg py-2 text-center text-[11px] font-bold shadow-md">15% — Stage 1</div>
          </div>
          <div className="mt-3 space-y-0">
            {[['Entry order', '1 → 2 → 3'], ['Exit order', '3 → 2 → 1'], ['Exit trigger', 'ANY stage hits target']].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-t2">{l}</span>
                <span className="text-xs font-bold font-mono">{v}</span>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard>
          <div className="font-display text-[15px] font-bold mb-3">📤 Exit Strategy Logic</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-green/5 border border-green/20 rounded-lg p-3">
              <div className="text-[10px] font-bold text-green-bright mb-1">✅ Fair Premium</div>
              <div className="text-[11px] text-t2">Looser trail (45%) → Captures bigger moves</div>
            </div>
            <div className="bg-amber/5 border border-amber/20 rounded-lg p-3">
              <div className="text-[10px] font-bold text-amber mb-1">⚠ Overpriced</div>
              <div className="text-[11px] text-t2">Tighter trail (60%) → Protects from reversals</div>
            </div>
          </div>
          {[['On target hit', `Exit ${es.immediate_exit_percent}% immediately`], ['Remaining', `${es.trailing_exit_percent}% with trailing stop`]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-t2">{l}</span>
              <span className="text-xs font-bold font-mono">{v}</span>
            </div>
          ))}
        </DashCard>

        <DashCard>
          <div className="font-display text-[15px] font-bold mb-3">🛑 Stop Loss Logic</div>
          {[['Formula', 'Spot ≤ CP − Offset'], ['Action', 'Close ALL'], ['CSV column', 'Condition_Price']].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-t2">{l}</span>
              <span className={`text-xs font-bold font-mono ${v === 'Close ALL' ? 'text-red' : v === 'Condition_Price' ? 'text-primary' : ''}`}>{v}</span>
            </div>
          ))}
        </DashCard>

        <DashCard>
          <div className="font-display text-[15px] font-bold mb-3">💡 Pricing Guide</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green/5 border border-green/20 rounded-lg p-3.5 text-center">
              <div className="text-[10px] font-bold text-green-bright mb-1">✅ Fair</div>
              <div className="font-display text-xl font-black text-green-bright">{localConfig.profit_targets.fair}%</div>
              <div className="text-[10px] text-t2 mt-1">Full capital</div>
            </div>
            <div className="bg-amber/5 border border-amber/20 rounded-lg p-3.5 text-center">
              <div className="text-[10px] font-bold text-amber mb-1">⚠ Overpriced</div>
              <div className="font-display text-xl font-black text-amber">{localConfig.profit_targets.overpriced}%</div>
              <div className="text-[10px] text-t2 mt-1">70% capital</div>
            </div>
          </div>
        </DashCard>

        <DashCard>
          <div className="font-display text-[15px] font-bold mb-3">⏰ Market Hours (IST)</div>
          {[['Pre-market', '9:00 – 9:15 AM'], ['Trading', '9:15 AM – 3:30 PM'], ['Close by', '3:20 PM'], ['NIFTY expiry', 'Tuesday (weekly)'], ['BANKNIFTY expiry', 'Last Tuesday (monthly)']].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-t2">{l}</span>
              <span className={`text-xs font-bold font-mono ${v?.includes('3:20') ? 'text-red' : v?.includes('3:30') ? 'text-green-bright' : ''}`}>{v}</span>
            </div>
          ))}
        </DashCard>
      </div>
    </div>
  );
};

export default ConfigurePage;
