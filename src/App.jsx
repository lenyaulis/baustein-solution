// src/App.jsx
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import QuarryRegistriesPage from './pages/QuarryRegistriesPage';
import HelpPage from './pages/HelpPage';
import RequestsPage from './pages/RequestsPage';
import ReportsPageInner from './pages/ReportsPageInner';
import AllRequestsPage from './pages/AllRequestsPage';
import RemindersPage from './pages/RemindersPage';
import { useRequestsStore } from './hooks/useRequestsStore';
import { useRemindersStore } from './hooks/useRemindersStore';

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
    addDriverMaterial,
    addDriverService,
    addQuarry,
    addPickup,
    removeRequest,
    loading,
    error,
    updateRequest,
  } = useRequestsStore();

  const { activeRemindersCount } = useRemindersStore();

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
              to="/reminders"
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' sidebar-link-active' : '')
              }
            >
              Напоминания
              {activeRemindersCount > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: 11,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 6px',
                  }}
                >
                  {activeRemindersCount}
                </span>
              )}
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
          {loading && (
            <div
              style={{
                marginBottom: 12,
                padding: '8px 10px',
                borderRadius: 8,
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: 13,
              }}
            >
              Загрузка заявок из облака...
            </div>
          )}

          {error && (
            <div
              style={{
                marginBottom: 12,
                padding: '8px 10px',
                borderRadius: 8,
                background: '#fef2f2',
                color: '#b91c1c',
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

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
                  addDriverMaterial={addDriverMaterial}
                  addDriverService={addDriverService}
                  addQuarry={addQuarry}
                  addPickup={addPickup}
                  removeRequest={removeRequest}
                  updateRequest={updateRequest}
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

            <Route path="/reminders" element={<RemindersPage />} />

            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </main>
      </div>

      {/* Плашка снизу */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          Приложение еще в разработке. Разработано by Ulis. Почта:{' '}
          <a href="mailto:s3ko2000@yandex.ru"> s3ko2000@yandex.ru</a>. 13.01.2026
        </div>
      </footer>
    </div>
  );
}

export default App;
