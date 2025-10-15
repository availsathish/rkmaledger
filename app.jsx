import React, { useState, useMemo } from 'react';

// --- IMPORTANT ---
// For PDF export to work, you need to add these scripts to your main HTML file (e.g., index.html)
// <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
// <script src="https://unpkg.com/jspdf-autotable@latest/dist/jspdf.plugin.autotable.js"></script>

// --- Helper Functions & Constants ---
const THEME = {
  primary: '#1a73e8',
  secondary: '#f1f3f4',
  text: '#202124',
  textSecondary: '#5f6368',
  background: '#ffffff',
  danger: '#d93025',
  success: '#1e8e3e',
  border: '#dadce0',
};

const formatCurrency = (amount) => {
  const isNegative = amount < 0;
  const formatted = `₹${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  return isNegative ? `-${formatted}` : formatted;
};


// --- SVG Icons (as React Components) ---
const PlusCircleIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const ArrowLeftIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const UserPlusIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line>
    </svg>
);

const EditIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = ({ size = 18, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const DownloadIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


// --- Initial Dummy Data ---
const initialCustomers = [
  {id: 1, name: 'Sri Velavan Textiles', transactions: [{ id: 1, type: 'credit', amount: 50000, description: 'Opening Balance', date: '2023-10-01' }, { id: 2, type: 'debit', amount: 15000, description: 'Invoice #101', date: '2023-10-05' }, { id: 3, type: 'credit', amount: 10000, description: 'Payment Received', date: '2023-10-10' },],},
  {id: 2, name: 'Karpagam Looms', transactions: [{ id: 4, type: 'credit', amount: 25000, description: 'Opening Balance', date: '2023-10-02' }, { id: 5, type: 'debit', amount: 30000, description: 'Invoice #102', date: '2023-10-08' },],},
  {id: 3, name: 'Pioneer Weavers Inc.', transactions: [{ id: 6, type: 'debit', amount: 75000, description: 'Invoice #103', date: '2023-10-11' }, { id: 7, type: 'credit', amount: 75000, description: 'Full Payment Cleared', date: '2023-10-15' },],},
];


// --- Reusable Components ---
const AppHeader = ({ title, onBack, showAddCustomer, onAddCustomer }) => (
  <div style={styles.header}><div style={styles.headerContent}>{onBack && (<button onClick={onBack} style={styles.backButton}><ArrowLeftIcon color={THEME.background} /></button>)}<h1 style={styles.headerTitle}>{title}</h1></div>{showAddCustomer && (<button onClick={onAddCustomer} style={styles.addCustomerButton}><UserPlusIcon color={THEME.background} /></button>)}</div>
);

const BalanceSummary = ({ totalBalance }) => {
    const balanceColor = totalBalance >= 0 ? THEME.success : THEME.danger;
    const balanceLabel = totalBalance >= 0 ? 'Total to Collect' : 'Total to Pay';
    return (<div style={styles.summaryContainer}><p style={styles.summaryLabel}>{balanceLabel}</p><p style={{...styles.summaryBalance, color: balanceColor }}>{formatCurrency(Math.abs(totalBalance))}</p></div>);
};


// --- Main App Component ---
export default function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'addCustomer', 'addTransaction', 'editCustomer', 'deleteItem', 'editTransaction'
  
  // Form States
  const [formError, setFormError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionType, setTransactionType] = useState('credit'); 

  // --- Computed Values ---
  const customerBalances = useMemo(() => {
    const balances = {};
    customers.forEach(customer => {
      const balance = customer.transactions.reduce((acc, t) => t.type === 'credit' ? acc - t.amount : acc + t.amount, 0);
      balances[customer.id] = balance;
    });
    return balances;
  }, [customers]);

  const totalNetBalance = useMemo(() => Object.values(customerBalances).reduce((sum, bal) => sum + bal, 0), [customerBalances]);

  const filteredCustomers = useMemo(() => customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())), [customers, searchTerm]);

  // --- Modal Management ---
  const closeModal = () => {
    setModal({ type: null, data: null });
    setFormError('');
    setCustomerName('');
    setOpeningBalance('');
    setTransactionAmount('');
    setTransactionDescription('');
  };
  
  // --- Handlers ---
  const handleSelectCustomer = (customer) => setSelectedCustomer(customer);
  const handleGoBack = () => setSelectedCustomer(null);
  
  const handleAddNewCustomer = () => {
      if (!customerName.trim() || !openingBalance.trim() || isNaN(parseFloat(openingBalance))) { setFormError("Please fill all fields correctly."); return; }
      const newCustomer = { id: Date.now(), name: customerName, transactions: [{ id: Date.now() + 1, type: 'debit', amount: parseFloat(openingBalance), description: 'Opening Balance', date: new Date().toISOString().split('T')[0] }] };
      setCustomers([...customers, newCustomer]);
      closeModal();
  };
  
  const handleUpdateCustomer = () => {
      if(!customerName.trim()){ setFormError("Customer name cannot be empty."); return; }
      setCustomers(customers.map(c => c.id === modal.data.id ? {...c, name: customerName } : c));
      closeModal();
  };
  
  const handleDeleteItem = () => {
      if(modal.data.type === 'customer'){
          setCustomers(customers.filter(c => c.id !== modal.data.id));
          handleGoBack(); // Go back if deleting the selected customer
      } else if (modal.data.type === 'transaction'){
          const updatedCustomers = customers.map(c => {
              if(c.id === selectedCustomer.id){
                  return {...c, transactions: c.transactions.filter(t => t.id !== modal.data.id)}
              }
              return c;
          });
          setCustomers(updatedCustomers);
          setSelectedCustomer(updatedCustomers.find(c => c.id === selectedCustomer.id));
      }
      closeModal();
  };

  const handleAddNewTransaction = () => {
    if (!transactionAmount.trim() || !transactionDescription.trim() || isNaN(parseFloat(transactionAmount)) || !selectedCustomer) { setFormError("Please fill all fields correctly."); return; }
    const newTransaction = { id: Date.now(), type: transactionType, amount: parseFloat(transactionAmount), description: transactionDescription, date: new Date().toISOString().split('T')[0] };
    const updatedCustomers = customers.map(c => c.id === selectedCustomer.id ? { ...c, transactions: [...c.transactions, newTransaction] } : c);
    setCustomers(updatedCustomers);
    setSelectedCustomer(updatedCustomers.find(c => c.id === selectedCustomer.id));
    closeModal();
  };
  
  const handleUpdateTransaction = () => {
      if(!transactionAmount.trim() || !transactionDescription.trim() || isNaN(parseFloat(transactionAmount))){ setFormError("Please fill all fields correctly."); return; }
      const updatedCustomers = customers.map(c => {
          if(c.id === selectedCustomer.id) {
              return {...c, transactions: c.transactions.map(t => t.id === modal.data.id ? {...t, amount: parseFloat(transactionAmount), description: transactionDescription} : t)}
          }
          return c;
      });
      setCustomers(updatedCustomers);
      setSelectedCustomer(updatedCustomers.find(c => c.id === selectedCustomer.id));
      closeModal();
  }

  const handleExportPdf = () => {
    if (!selectedCustomer) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const balance = customerBalances[selectedCustomer.id];
    const balanceText = balance >= 0 ? `${formatCurrency(balance)} Dr` : `${formatCurrency(Math.abs(balance))} Cr`;

    doc.setFontSize(20);
    doc.text("RKM Loom Spares", 14, 22);
    doc.setFontSize(12);
    doc.text(`Ledger for: ${selectedCustomer.name}`, 14, 30);
    doc.text(`Current Balance: ${balanceText}`, 14, 36);

    const tableColumn = ["Date", "Description", "Debit", "Credit"];
    const tableRows = [];

    selectedCustomer.transactions.forEach(t => {
        const transactionData = [
            new Date(t.date).toLocaleDateString('en-GB'),
            t.description,
            t.type === 'debit' ? formatCurrency(t.amount) : '',
            t.type === 'credit' ? formatCurrency(t.amount) : '',
        ];
        tableRows.push(transactionData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        headStyles: { fillColor: [26, 115, 232] },
        styles: { halign: 'center' },
        columnStyles: { 1: { halign: 'left' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });
    
    doc.save(`Ledger-${selectedCustomer.name.replace(" ", "_")}.pdf`);
  };

  // --- Render Functions ---
  const renderCustomerList = () => (
    <>
      <AppHeader title="Customer Ledger" showAddCustomer={() => setModal({ type: 'addCustomer', data: null})} />
      <div style={styles.searchContainer}><input type="text" placeholder="Search customers..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
      <BalanceSummary totalBalance={totalNetBalance} />
      <div style={styles.scrollView}>
        {filteredCustomers.map(customer => {
          const balance = customerBalances[customer.id];
          const balanceColor = balance >= 0 ? THEME.success : THEME.danger;
          const balanceText = balance >= 0 ? `${formatCurrency(balance)} Dr` : `${formatCurrency(Math.abs(balance))} Cr`;
          return (
            <div key={customer.id} style={styles.customerCard}>
              <div style={{flex: 1, cursor: 'pointer'}} onClick={() => handleSelectCustomer(customer)}>
                <p style={styles.customerName}>{customer.name}</p>
                <p style={styles.transactionCount}>{customer.transactions.length} Transactions</p>
              </div>
              <p style={{ ...styles.customerBalance, color: balanceColor }}>{balanceText}</p>
              <div style={styles.itemActions}>
                  <button style={styles.iconButton} onClick={(e) => { e.stopPropagation(); setCustomerName(customer.name); setModal({ type: 'editCustomer', data: customer })}}><EditIcon/></button>
                  <button style={styles.iconButton} onClick={(e) => { e.stopPropagation(); setModal({ type: 'deleteItem', data: {id: customer.id, name: customer.name, type: 'customer'}})}}><TrashIcon/></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;
    return (
      <>
        <AppHeader title={selectedCustomer.name} onBack={handleGoBack} />
        <div style={styles.detailHeader}><p style={styles.detailBalance}>Balance: {customerBalances[selectedCustomer.id] >= 0 ? `${formatCurrency(customerBalances[selectedCustomer.id])} Dr` : `${formatCurrency(Math.abs(customerBalances[selectedCustomer.id]))} Cr`}</p><button style={styles.pdfButton} onClick={handleExportPdf}><DownloadIcon color="#fff"/> Export PDF</button></div>
        <div style={styles.scrollView}>
            {selectedCustomer.transactions.slice().reverse().map(t => (
                <div key={t.id} style={styles.transactionCard}>
                   <div style={styles.transactionInfo}><p style={styles.transactionDesc}>{t.description}</p><p style={styles.transactionDate}>{new Date(t.date).toLocaleDateString('en-GB')}</p></div>
                   <div style={styles.transactionAmounts}><span style={{ ...styles.transactionAmount, color: t.type === 'debit' ? THEME.danger : 'transparent' }}>{t.type === 'debit' ? formatCurrency(t.amount) : ''}</span><span style={{ ...styles.transactionAmount, color: t.type === 'credit' ? THEME.success : 'transparent' }}>{t.type === 'credit' ? formatCurrency(t.amount) : ''}</span></div>
                   <div style={styles.itemActions}>
                       <button style={styles.iconButton} onClick={() => { setTransactionAmount(t.amount); setTransactionDescription(t.description); setModal({ type: 'editTransaction', data: t })}}><EditIcon/></button>
                       <button style={styles.iconButton} onClick={() => setModal({ type: 'deleteItem', data: {id: t.id, name: t.description, type: 'transaction'}})}><TrashIcon/></button>
                   </div>
                </div>
            ))}
        </div>
        <div style={styles.actionButtonsContainer}>
            <button style={{...styles.actionButton, ...styles.creditButton}} onClick={() => {setTransactionType('credit'); setModal({ type: 'addTransaction', data: null})}}><PlusCircleIcon color="#fff" size={20} /><span style={styles.actionButtonText}>Credit (Payment In)</span></button>
            <button style={{...styles.actionButton, ...styles.debitButton}} onClick={() => {setTransactionType('debit'); setModal({ type: 'addTransaction', data: null})}}><PlusCircleIcon color="#fff" size={20} /><span style={styles.actionButtonText}>Debit (Sale)</span></button>
        </div>
      </>
    );
  };
  
  const renderModals = () => {
    if (!modal.type) return null;
    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                { modal.type === 'addCustomer' && (<><p style={styles.modalTitle}>Add New Customer</p><input style={styles.input} placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /><input style={styles.input} placeholder="Opening Balance (Debit)" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} type="number" />{formError && <p style={styles.errorText}>{formError}</p>}<div style={styles.modalActions}><button style={{...styles.button, ...styles.buttonClose}} onClick={closeModal}><span style={styles.buttonText}>Cancel</span></button><button style={{...styles.button, ...styles.buttonPrimary}} onClick={handleAddNewCustomer}><span style={styles.buttonText}>Save Customer</span></button></div></>) }
                { modal.type === 'editCustomer' && (<><p style={styles.modalTitle}>Edit Customer</p><input style={styles.input} placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />{formError && <p style={styles.errorText}>{formError}</p>}<div style={styles.modalActions}><button style={{...styles.button, ...styles.buttonClose}} onClick={closeModal}><span style={styles.buttonText}>Cancel</span></button><button style={{...styles.button, ...styles.buttonPrimary}} onClick={handleUpdateCustomer}><span style={styles.buttonText}>Update</span></button></div></>) }
                { modal.type === 'addTransaction' && (<><p style={styles.modalTitle}>{transactionType === 'credit' ? 'Add Credit' : 'Add Debit'}</p><input style={styles.input} placeholder="Amount" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} type="number" /><input style={styles.input} placeholder="Description" value={transactionDescription} onChange={(e) => setTransactionDescription(e.target.value)} />{formError && <p style={styles.errorText}>{formError}</p>}<div style={styles.modalActions}><button style={{...styles.button, ...styles.buttonClose}} onClick={closeModal}><span style={styles.buttonText}>Cancel</span></button><button style={{...styles.button, ...styles.buttonPrimary}} onClick={handleAddNewTransaction}><span style={styles.buttonText}>Add</span></button></div></>) }
                { modal.type === 'editTransaction' && (<><p style={styles.modalTitle}>Edit Transaction</p><input style={styles.input} placeholder="Amount" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} type="number" /><input style={styles.input} placeholder="Description" value={transactionDescription} onChange={(e) => setTransactionDescription(e.target.value)} />{formError && <p style={styles.errorText}>{formError}</p>}<div style={styles.modalActions}><button style={{...styles.button, ...styles.buttonClose}} onClick={closeModal}><span style={styles.buttonText}>Cancel</span></button><button style={{...styles.button, ...styles.buttonPrimary}} onClick={handleUpdateTransaction}><span style={styles.buttonText}>Update</span></button></div></>) }
                { modal.type === 'deleteItem' && (<><p style={styles.modalTitle}>Confirm Deletion</p><p style={styles.confirmText}>Are you sure you want to delete "{modal.data.name}"? This action cannot be undone.</p><div style={styles.modalActions}><button style={{...styles.button, ...styles.buttonClose}} onClick={closeModal}><span style={styles.buttonText}>Cancel</span></button><button style={{...styles.button, ...styles.buttonDanger}} onClick={handleDeleteItem}><span style={styles.buttonText}>Delete</span></button></div></>) }
            </div>
        </div>
    );
  }

  return (
    <div style={styles.container}><div style={styles.appWrapper}><div style={styles.titleBar}><p style={styles.titleText}>RKM Customer Ledger</p></div>{selectedCustomer ? renderCustomerDetails() : renderCustomerList()}{renderModals()}</div></div>
  );
}


// --- Styles ---
const styles = {
  container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', backgroundColor: '#f0f2f5', },
  appWrapper: { width: '100%', maxWidth: 420, height: '100%', maxHeight: 800, backgroundColor: THEME.background, borderRadius: 20, overflow: 'hidden', boxShadow: "0 10px 20px rgba(0,0,0,0.1)", display: 'flex', flexDirection: 'column', },
  titleBar: { backgroundColor: '#333', padding: '10px 20px', textAlign: 'center', },
  titleText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, margin: 0, },
  header: { backgroundColor: THEME.primary, padding: '20px 15px 15px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', },
  headerContent: { display: 'flex', alignItems: 'center', },
  headerTitle: { color: THEME.background, fontSize: 20, fontWeight: 'bold', margin: 0, },
  backButton: { marginRight: 15, background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  addCustomerButton:{ padding: 5, background: 'none', border: 'none', cursor: 'pointer', },
  summaryContainer: { backgroundColor: THEME.secondary, padding: 20, borderBottom: `1px solid ${THEME.border}`, textAlign: 'center', },
  summaryLabel: { fontSize: 14, color: THEME.textSecondary, marginBottom: 4, margin: 0, },
  summaryBalance: { fontSize: 28, fontWeight: 'bold', margin: 0, },
  searchContainer: { padding: '10px 15px', backgroundColor: THEME.secondary, borderBottom: `1px solid ${THEME.border}` },
  searchInput: { width: '100%', padding: '10px 15px', fontSize: 16, borderRadius: 8, border: `1px solid ${THEME.border}`, boxSizing: 'border-box' },
  scrollView: { flex: 1, overflowY: 'auto', },
  customerCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: `1px solid ${THEME.border}`, },
  customerName: { fontSize: 16, fontWeight: '500', color: THEME.text, margin: 0, },
  transactionCount: { fontSize: 12, color: THEME.textSecondary, marginTop: 4, margin: 0, },
  customerBalance: { fontSize: 16, fontWeight: 'bold', margin: '0 10px 0 0', },
  detailHeader: { padding: 20, backgroundColor: THEME.secondary, borderBottom: `1px solid ${THEME.border}`, textAlign: 'center', },
  detailBalance: { fontSize: 22, fontWeight: 'bold', color: THEME.text, margin: 0, marginBottom: 15 },
  pdfButton: { backgroundColor: THEME.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 15px', fontSize: 14, fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' },
  transactionCard: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: `1px solid ${THEME.border}`, alignItems: 'center' },
  transactionInfo:{ flex: 1, },
  transactionDesc: { fontSize: 15, color: THEME.text, marginBottom: 4, margin: 0, },
  transactionDate: { fontSize: 12, color: THEME.textSecondary, margin: 0, },
  transactionAmounts: { display: 'flex', minWidth: 180, justifyContent: 'space-between', },
  transactionAmount: { fontSize: 15, fontWeight: '500', width: 90, textAlign: 'right' },
  itemActions: { display: 'flex', alignItems: 'center', marginLeft: 10 },
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: THEME.textSecondary, ':hover': { color: THEME.primary } },
  actionButtonsContainer: { display: 'flex', padding: 10, borderTop: `1px solid ${THEME.border}`, },
  actionButton: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, margin: 5, border: 'none', cursor: 'pointer', },
  creditButton: { backgroundColor: THEME.success, },
  debitButton: { backgroundColor: THEME.danger, },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8, },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, },
  modalContent: { width: '90%', maxWidth: 380, backgroundColor: 'white', borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', margin: '0 0 20px 0' },
  confirmText: { textAlign: 'center', marginBottom: 20, color: THEME.textSecondary, lineHeight: 1.5 },
  input: { boxSizing: 'border-box', width: '100%', height: 50, borderColor: THEME.border, borderWidth: 1, borderStyle: 'solid', marginBottom: 15, padding: '0 15px', borderRadius: 8, fontSize: 16, },
  modalActions: { display: 'flex', justifyContent: 'space-between', marginTop: 10, },
  button: { flex: 1, padding: 15, borderRadius: 8, textAlign: 'center', margin: '0 5px', border: 'none', cursor: 'pointer', },
  buttonPrimary: { backgroundColor: THEME.primary, },
  buttonClose: { backgroundColor: THEME.textSecondary, },
  buttonDanger: { backgroundColor: THEME.danger },
  buttonText: { color: 'white', fontWeight: 'bold', },
  errorText: { color: THEME.danger, textAlign: 'center', marginBottom: 10, }
};

