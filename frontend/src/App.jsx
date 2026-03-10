import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // تهيئة Telegram Web App
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const initData = tg.initDataUnsafe?.user;
      setUser(initData);
      
      // إذا كان المستخدم مسجل دخوله، نضيفه لقاعدة البيانات
      if (initData) {
        axios.post(`${import.meta.env.VITE_API_URL}/users`, {
          id: initData.id,
          username: initData.username,
          first_name: initData.first_name
        }).catch(err => console.log('المستخدم موجود مسبقاً'));
        
        // جلب الرصيد
        axios.get(`${import.meta.env.VITE_API_URL}/users/${initData.id}/balance`)
          .then(res => setBalance(res.data.balance))
          .catch(err => console.log('لم يتم العثور على رصيد'));
      }
    }

    // جلب الأقسام من Backend
    axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('خطأ في جلب الأقسام:', err));
  }, []);

  // دالة لعرض المحتوى حسب التبويب النشط
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div>
            <h2>الأقسام</h2>
            <div style={styles.grid}>
              {categories.map(cat => (
                <div key={cat.id} style={styles.categoryCard}>
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        );
      case 'orders':
        return (
          <div>
            <h2>طلباتي</h2>
            <p>لا توجد طلبات بعد</p>
          </div>
        );
      case 'recharge':
        return (
          <div>
            <h2>شحن الرصيد</h2>
            <p>اختر طريقة الشحن</p>
            <div style={styles.paymentOptions}>
              <button style={styles.paymentButton}>USDT (BEP20)</button>
              <button style={styles.paymentButton}>USDT (TRC20)</button>
              <button style={styles.paymentButton}>Binance Pay</button>
              <button style={styles.paymentButton}>شام كاش</button>
            </div>
          </div>
        );
      case 'history':
        return (
          <div>
            <h2>سجل الإيداعات</h2>
            <p>لا توجد إيداعات بعد</p>
          </div>
        );
      case 'contact':
        return (
          <div>
            <h2>اتصل بنا</h2>
            <p>للتواصل والدعم: @MrVIP_Support</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div dir="rtl" style={styles.container}>
      {/* الهيدر العلوي */}
      <header style={styles.header}>
        <h1 style={styles.title}>MrVIP Store</h1>
        <div style={styles.userInfo}>
          <span>معرف: {user?.id || 'غير معروف'}</span>
          <span style={styles.balance}>💰 ${balance}</span>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={styles.main}>
        {renderContent()}
      </main>

      {/* شريط التنقل السفلي */}
      <nav style={styles.bottomNav}>
        <button 
          style={{...styles.navButton, ...(activeTab === 'home' ? styles.activeNav : {})}} 
          onClick={() => setActiveTab('home')}
        >
          🏠 الرئيسية
        </button>
        <button 
          style={{...styles.navButton, ...(activeTab === 'orders' ? styles.activeNav : {})}} 
          onClick={() => setActiveTab('orders')}
        >
          📦 طلباتي
        </button>
        <button 
          style={{...styles.navButton, ...(activeTab === 'recharge' ? styles.activeNav : {})}} 
          onClick={() => setActiveTab('recharge')}
        >
          💳 شحن
        </button>
        <button 
          style={{...styles.navButton, ...(activeTab === 'history' ? styles.activeNav : {})}} 
          onClick={() => setActiveTab('history')}
        >
          📜 السجل
        </button>
        <button 
          style={{...styles.navButton, ...(activeTab === 'contact' ? styles.activeNav : {})}} 
          onClick={() => setActiveTab('contact')}
        >
          📞 اتصل بنا
        </button>
      </nav>
    </div>
  );
}

// أنماط CSS
const styles = {
  container: {
    fontFamily: 'Tahoma, Arial, sans-serif',
    maxWidth: '100%',
    minHeight: '100vh',
    background: '#f5f5f5',
    position: 'relative',
    paddingBottom: '70px'
  },
  header: {
    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: 'white',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    textAlign: 'center'
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    fontSize: '14px'
  },
  balance: {
    background: 'rgba(255,255,255,0.2)',
    padding: '5px 10px',
    borderRadius: '20px'
  },
  main: {
    padding: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginTop: '10px'
  },
  categoryCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 5px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  navButton: {
    border: 'none',
    background: 'none',
    padding: '8px',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s'
  },
  activeNav: {
    background: '#4CAF50',
    color: 'white'
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px'
  },
  paymentButton: {
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    background: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  }
};

export default App;