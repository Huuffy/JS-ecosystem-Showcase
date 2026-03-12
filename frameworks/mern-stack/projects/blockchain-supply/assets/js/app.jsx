const { useState, useEffect, useRef } = React;

const generateHash = () => {
    return '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

function App() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [ledger, setLedger] = useState([
        { id: 1, hash: '0x8f2d5ae6b2c45199...', action: 'Smart Contract Deployed', time: '10:00 AM' },
        { id: 2, hash: '0x3ef1c4a92bb8dc7f...', action: 'Manufacturer Registered', time: '10:05 AM' }
    ]);
    const endOfLogRef = useRef(null);

    const connectWallet = () => {
        setWalletConnected(true);
        addLedgerEntry('MetaMask Wallet Connected: 0x71C...976F');
    };

    const addLedgerEntry = (action) => {
        setLedger(prev => [...prev, {
            id: Date.now(),
            hash: generateHash(),
            action: action,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})
        }]);
    };

    useEffect(() => {
        if (endOfLogRef.current) {
            endOfLogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [ledger]);

    const advanceStage = (stageName) => {
        addLedgerEntry(`Awaiting MetaMask Signature for: ${stageName}`);
        
        setTimeout(() => {
            setCurrentStage(prev => prev + 1);
            addLedgerEntry(`${stageName} Verified on Blockchain. Payment Escrow Released.`);
        }, 1500);
    };

    return (
        <div className="bc-container">
            <header className="bc-header">
                <div className="bc-brand">
                    <i className="fa-brands fa-ethereum"></i> BlockSupply
                </div>
                <button className="wallet-connect" onClick={connectWallet}>
                    <i className="fas fa-wallet"></i>
                    {walletConnected ? '0x71C...976F' : 'Connect Web3 Wallet'}
                </button>
            </header>

            <main className="bc-main">
                <div className="panel">
                    <div className="panel-title">
                        <i className="fas fa-route"></i> Smart Contract Lifecycle
                    </div>
                    
                    <div className="timeline">
                        {/* Stage 1: Manufacturing */}
                        <div className={`timeline-step ${currentStage > 1 ? 'completed' : currentStage === 1 ? 'active' : ''}`}>
                            <div className="step-icon">
                                {currentStage > 1 ? <i className="fas fa-check"></i> : <i className="fas fa-industry"></i>}
                            </div>
                            <div className="step-content">
                                <div className="step-title">1. Product Manufactured</div>
                                <div className="step-desc">IoT sensors write batch metadata directly to MongoDB and save the unalterable hash to the Ethereum chain.</div>
                                
                                {currentStage === 1 && (
                                    <div className="contract-data">
                                        <div className="data-row"><span className="data-label">Batch ID:</span><span className="data-value">BTH-9021-A</span></div>
                                        <div className="data-row"><span className="data-label">Location:</span><span className="data-value">Shenzhen, CH</span></div>
                                        <button 
                                            className="action-btn" 
                                            disabled={!walletConnected}
                                            onClick={() => advanceStage('Manufacturing Log')}
                                        >
                                            {walletConnected ? 'Sign Transaction (MetaMask)' : 'Connect Wallet to Sign'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stage 2: Transit */}
                        <div className={`timeline-step ${currentStage > 2 ? 'completed' : currentStage === 2 ? 'active' : ''}`}>
                            <div className="step-icon">
                                {currentStage > 2 ? <i className="fas fa-check"></i> : <i className="fas fa-ship"></i>}
                            </div>
                            <div className="step-content">
                                <div className="step-title">2. In Transit to Distributor</div>
                                <div className="step-desc">Logistics provider claims the payload. Smart contract transfers ownership and updates GPS data.</div>
                                
                                {currentStage === 2 && (
                                    <div className="contract-data">
                                        <div className="data-row"><span className="data-label">Vessel:</span><span className="data-value">Ever Given V</span></div>
                                        <div className="data-row"><span className="data-label">Temp Log:</span><span className="data-value">-18.4°C (Valid)</span></div>
                                        <button 
                                            className="action-btn"
                                            onClick={() => advanceStage('Transfer of Ownership')}
                                        >
                                            Sign Transit Handover
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stage 3: Delivery */}
                        <div className={`timeline-step ${currentStage > 3 ? 'completed' : currentStage === 3 ? 'active' : ''}`}>
                            <div className="step-icon">
                                {currentStage > 3 ? <i className="fas fa-check"></i> : <i className="fas fa-box-open"></i>}
                            </div>
                            <div className="step-content">
                                <div className="step-title">3. Final Delivery & Payment</div>
                                <div className="step-desc">Retailer verifies shipment hash. Smart Contract automatically releases USDC funds from Escrow.</div>
                                
                                {currentStage === 3 && (
                                    <div className="contract-data">
                                        <div className="data-row"><span className="data-label">Contract Status:</span><span className="data-value" style={{color: '#f59e0b'}}>Escrow Locked</span></div>
                                        <div className="data-row"><span className="data-label">Payment Due:</span><span className="data-value">14,500 USDC</span></div>
                                        <button 
                                            className="action-btn"
                                            onClick={() => advanceStage('Final Delivery verification')}
                                        >
                                            Verify & Release Funds
                                        </button>
                                    </div>
                                )}
                                
                                {currentStage > 3 && (
                                    <div style={{ marginTop: '16px', color: 'var(--bc-success)', fontWeight: '600' }}>
                                        <i className="fas fa-check-circle"></i> Contract Executed. Funds Settled.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-title">
                        <i className="fas fa-list-alt"></i> MongoDB + Web3 Ledger
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--bc-muted)', marginBottom: '16px' }}>
                        Live stream of hybridized MongoDB documents and Ethereum block hashes.
                    </div>
                    
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {ledger.map(entry => (
                            <div key={entry.id} className="ledger-entry">
                                <div className="ledger-hash">{entry.hash}</div>
                                <div className="ledger-meta">
                                    <span>{entry.action}</span>
                                    <span>{entry.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={endOfLogRef} />
                    </div>
                </div>
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
