// src/pages/HelpPage.jsx
function HelpPage() {
  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Справка</h1>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="form-section" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
          <div className="form-section-title">Общее</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Приложение хранит все заявки в браузере (localStorage), данные не пропадают при обновлении страницы.</li>
            <li>Навигация слева: «Заявки», «Все заявки», «Реестры карьеров», «Отчеты», «Справка».</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Заявки исполнителю</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Заявки» выбери вкладку «Материал», «Услуга» или «Самовывоз» вверху.</li>
            <li>Заполни форму, нажми «Сохранить заявку» — заявка появится в списке ниже.</li>
            <li>Кнопка с иконкой листа копирует текст заявки для отправки в мессенджер.</li>
            <li>Зелёная кнопка с бумажным самолётом открывает Telegram указанного исполнителя (если контакт привязан).</li>
            <li>Карандаш — редактирование заявки; красная кнопка «Удалить» — полное удаление.</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Заявки карьерам</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Открой «Заявки» → вкладку «Заявки карьерам» сверху.</li>
            <li>Заполни форму карьера и нажми «Сохранить заявку».</li>
            <li>Кнопка копирования формирует текст заявки с нужным форматом под выбранный карьер.</li>
            <li>Зелёная кнопка открывает Telegram контакта карьера, если он указан.</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Все заявки за день</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Раздел «Все заявки» показывает все заявки на выбранную дату.</li>
            <li>Сверху выбери дату — ниже отобразятся заявки исполнителю и карьерам за этот день.</li>
            <li>Этот список только для просмотра; редактирование делается в разделе «Заявки».</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Реестры карьеров</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Реестры карьеров» формируй реестры по датам и рейсам.</li>
            <li>Данные подтягиваются из заявок карьерам; следи за правильным заполнением заявок.</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Отчеты</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Отчеты» выбери период «Дата с» и «Дата по» и нажми «Сформировать отчет».</li>
            <li>В Excel-отчёт попадают заявки исполнителю (материал, самовывоз, услуга) за выбранный период.</li>
            <li>В отчёте считаются суммы по клиенту, исполнителю, карьеру и прибыль по каждой строке.</li>
          </ul>
        </div>

        <div className="form-section">
          <div className="form-section-title">Хранение данных</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Все данные хранятся локально в браузере; при очистке истории/кэша они могут быть удалены.</li>
            <li>Для резервной копии можно периодически выгружать отчёт в Excel и сохранять файл.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
