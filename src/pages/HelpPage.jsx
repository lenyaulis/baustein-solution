// src/pages/HelpPage.jsx
function HelpPage() {
  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Справка</h1>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Общее */}
        <div className="form-section" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
          <div className="form-section-title">Общее</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Приложение хранит все заявки в браузере (localStorage), данные не пропадают при обновлении страницы.</li>
            <li>Основные разделы слева: «Карта», «Новая заявка», «Контакты», «Напоминания», «Документы на выдачу», «Отчеты», «Реестры карьеров», «Справка».</li>
          </ul>
        </div>

        {/* Новая заявка */}
        <div className="form-section">
          <div className="form-section-title">Новая заявка</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Новая заявка» выбери вкладку «Материал», «Услуга», «Самовывоз» или «Заявки карьерам» вверху.</li>
            <li>Заполни форму и нажми «Сохранить заявку» — заявка появится в списке ниже.</li>
            <li>Кнопка с иконкой листа копирует текст заявки для отправки в мессенджер.</li>
            <li>Зелёная кнопка с бумажным самолётом открывает Telegram указанного исполнителя/карьера (если контакт привязан).</li>
            <li>Карандаш — редактирование заявки; красная кнопка «Удалить» — полное удаление.</li>
          </ul>
        </div>

        {/* Карта */}
        <div className="form-section">
          <div className="form-section-title">Карта</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Карта» отображаются карьеры и точки, которые используются в заявках.</li>
            <li>Карта помогает быстро оценить расстояния, направления и подобрать оптимальный карьер по локации.</li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="form-section">
          <div className="form-section-title">Контакты</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Раздел «Контакты» — это справочник карьеров, перевозчиков, техники и клиентов.</li>
            <li>Используется для хранения телефонов и комментариев, чтобы быстро подставлять нужные данные в заявки.</li>
          </ul>
        </div>

        {/* Напоминания */}
        <div className="form-section">
          <div className="form-section-title">Напоминания</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Напоминания» можно создавать задачи по заявкам и клиентам с датой и временем.</li>
            <li>В меню рядом с пунктом «Напоминания» показывается количество активных напоминаний на сейчас.</li>
          </ul>
        </div>

        {/* Документы на выдачу */}
        <div className="form-section">
          <div className="form-section-title">Документы на выдачу</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>Раздел «Документы на выдачу» используется для контроля путевых листов, накладных и прочих документов, которые нужно отдать водителю или клиенту.</li>
            <li>Можно отмечать выданные документы и видеть, что ещё осталось подготовить.</li>
          </ul>
        </div>

        {/* Реестры карьеров */}
        <div className="form-section">
          <div className="form-section-title">Реестры карьеров</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Реестры карьеров» формируются табличные реестры по датам и рейсам.</li>
            <li>Данные подтягиваются из заявок карьерам; важно внимательно заполнять заявки, чтобы реестр был корректным.</li>
          </ul>
        </div>

        {/* Отчеты */}
        <div className="form-section">
          <div className="form-section-title">Отчеты</div>
          <ul style={{ fontSize: 13, color: '#374151', paddingLeft: 18, margin: 0 }}>
            <li>В разделе «Отчеты» выбери период «Дата с» и «Дата по» и нажми «Сформировать отчет».</li>
            <li>В Excel-отчёт попадают заявки исполнителю (материал, самовывоз, услуга) за выбранный период.</li>
            <li>В отчёте считаются суммы по клиенту, исполнителю, карьеру и прибыль по каждой строке.</li>
          </ul>
        </div>

        {/* Хранение данных */}
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
