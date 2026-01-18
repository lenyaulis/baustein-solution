// src/App.jsx
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import QuarryRegistriesPage from './pages/QuarryRegistriesPage';
import HelpPage from './pages/HelpPage';
import RequestsPage from './pages/RequestsPage';
import ReportsPageInner from './pages/ReportsPageInner';
import AllRequestsPage from './pages/AllRequestsPage';
import { usePersistedRequests } from './hooks/usePersistedRequests';

function App() {
  const {
    driverMaterialRequests,
    setDriverMaterialRequests,
    driverServiceRequests,
    setDriverServiceRequests,
    quarryRequests,
    setQuarryRequests,
    pickupRequests,
    setPickupRequests,
  } = usePersistedRequests();

  return (
    <div className="app-root">
      {/* Шапка */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo-block">
            <div className="app-header-title">
              <div className="app-header-title-main">Бауштайн.Решения</div>
            </div>
          </div>
        </div>
      </header>

      {/* Контент + сайдбар */}
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-title">Меню</div>
          <nav className="sidebar-nav">
            <NavLink
              to="/requests/drivers"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Заявки
            </NavLink>
            <NavLink
              to="/all-requests"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Все заявки
            </NavLink>
            <NavLink
              to="/registries/quarries"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Реестры карьеров
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Отчеты
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Справка
            </NavLink>
          </nav>
        </aside>

        <main className="main-area">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/requests/drivers" replace />}
            />

            <Route
              path="/requests/*"
              element={
                <RequestsPage
                  driverMaterialRequests={driverMaterialRequests}
                  setDriverMaterialRequests={setDriverMaterialRequests}
                  driverServiceRequests={driverServiceRequests}
                  setDriverServiceRequests={setDriverServiceRequests}
                  quarryRequests={quarryRequests}
                  setQuarryRequests={setQuarryRequests}
                  pickupRequests={pickupRequests}
                  setPickupRequests={setPickupRequests}
                />
              }
            />

            <Route
              path="/all-requests"
              element={
                <AllRequestsPage
                  driverMaterialRequests={driverMaterialRequests}
                  driverServiceRequests={driverServiceRequests}
                  pickupRequests={pickupRequests}
                  quarryRequests={quarryRequests}
                />
              }
            />

            <Route
              path="/registries/quarries"
              element={<QuarryRegistriesPage />}
            />

            <Route
              path="/reports"
              element={
                <ReportsPageInner
                  driverMaterialRequests={driverMaterialRequests}
                  driverServiceRequests={driverServiceRequests}
                  pickupRequests={pickupRequests}
                />
              }
            />

            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>

      {/* Плашка снизу */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          Приложение еще в разработке. Разработано by Ulis. Почта:{' '}
          <a href="mailto:s3ko2000@yandex.ru">s3ko2000@yandex.ru</a>. 13.01.2026
        </div>
      </footer>
    </div>
  );
}

export default App;
