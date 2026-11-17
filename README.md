# Remote Map Card

Кастомная Lovelace-карточка Home Assistant для создания интерактивного пульта управления. Можно использовать собственное изображение пульта или нарисовать его прямо в редакторе карточки.

<p align="center">
  <a href="README.md">🇷🇺 Русский</a> · <a href="README.en.md">🇬🇧 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.11.1-blue" alt="Version">
  <img src="https://img.shields.io/badge/HACS-Custom%20Repository-41BDF5" alt="HACS">
  <img src="https://img.shields.io/github/license/alshevskij/lovelace-remote-map-card" alt="License">
  <img src="https://img.shields.io/github/stars/alshevskij/lovelace-remote-map-card?style=flat" alt="GitHub Stars">
</p>

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=alshevskij&repository=lovelace-remote-map-card&category=plugin">
    <img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Открыть репозиторий Remote Map Card в HACS">
  </a>
</p>

## Возможности

- **Два режима оформления:**
  - **Нарисовать пульт** — холст с настраиваемыми кнопками, формами, цветами, текстом и значками.
  - **Своя картинка** — изображение пульта с размещёнными поверх него интерактивными зонами.
- Визуальный редактор: добавление, дублирование, удаление, перемещение и настройка кнопок.
- Изменение размера кнопок и зон нажатия.
- Стеклянный эффект, размытие и свечение в режиме нарисованного пульта.
- Сетка, привязка к сетке и направляющие для точного размещения.
- Поддержка действий Home Assistant: вызов действия/сервиса, переключение сущности, more-info, навигация и открытие URL.
- Отладочное отображение зон нажатия.
- Управление с мыши, сенсорного экрана и клавиатуры.

## Установка через HACS

### Через кнопку (рекомендуется)

Нажмите на бейдж **Open HACS repository** выше. Home Assistant откроет страницу репозитория в HACS или Marketplace. Подтвердите добавление пользовательского репозитория, если появится такой запрос, затем установите Remote Map Card.

### Вручную

1. Откройте HACS в Home Assistant.
2. Откройте меню и выберите **Custom repositories / Пользовательские репозитории**.
3. Добавьте репозиторий:
   - URL: `https://github.com/alshevskij/lovelace-remote-map-card`
   - Category: **Dashboard** (в старом интерфейсе HACS — **Plugin**).
4. Найдите **Remote Map Card** и установите её.
5. Обновите страницу Home Assistant.

Если ресурс не добавился автоматически (например, если ресурсы панели управления управляются вручную через YAML), откройте **Настройки → Панели управления → Ресурсы** и добавьте ресурс типа **JavaScript Module**:

`/hacsfiles/lovelace-remote-map-card/remote-map-card.js`

## Добавление карточки

Откройте редактор панели управления, добавьте карточку **Manual** и укажите тип:

```yaml
type: custom:remote-map-card
```

После добавления откройте визуальный редактор карточки.

## Режим «Нарисовать пульт»

В этом режиме фон и кнопки создаются средствами карточки. Основные параметры:

| Параметр | Назначение |
| --- | --- |
| `mode: designed` | Режим нарисованного пульта |
| `design.width` / `design.height` | Размер холста в пикселях |
| `design.background` | Цвет фона |
| `design.radius` | Скругление углов фона |
| `glass` | Стеклянный эффект |
| `glow` | Свечение при нажатии |
| `glass_opacity` | Прозрачность стеклянного фона, 10–100 |
| `glow_color` | Цвет свечения |
| `grid.show` | Показывать сетку в редакторе |
| `grid.snap` | Привязка к сетке |
| `grid.guides` | Направляющие по холсту и другим кнопкам |
| `grid.size` | Шаг сетки в пикселях |

Координаты `x` и `y` задаются в процентах относительно холста. Размеры `w` и `h` — в пикселях. Для круглых и квадратных кнопок высота автоматически равна ширине.

### Пример

```yaml
type: custom:remote-map-card
mode: designed
glass: true
glow: true
glass_opacity: 62
glow_color: "#60a5fa"
design:
  width: 436
  height: 781
  background: "#0a0c12"
  radius: 28
buttons:
  - name: Питание
    x: 50
    y: 15
    shape: circle
    w: 90
    h: 90
    color: "#d65b5b"
    content: icon
    icon: power
    icon_scale: 70
    text_color: "#ffffff"
    hit_scale: 100
    tap_action:
      action: perform-action
      perform_action: light.toggle
      target:
        entity_id: light.living_room
```

Доступные формы: `circle`, `oval`, `square`, `rect`, `rounded`, `pill`.

Содержимое кнопки:
- `text` — текст;
- `icon` — встроенная иконка;
- `none` — только форма и цвет.

Встроенные иконки: `up`, `down`, `left`, `right`, `plus`, `minus`, `power`, `play`, `pause`, `stop`, `ffwd`, `rew`, `heart`, `home`, `back`, `menu`, `mute`.

Параметр `hit_scale` задаёт размер интерактивной зоны относительно видимой кнопки в процентах.

## Режим «Своя картинка»

В этом режиме изображение служит фоном, а кнопки — невидимыми интерактивными зонами поверх него.

Изображение можно загрузить в визуальном редакторе перетаскиванием, выбором файла или вставкой изображения из буфера обмена. Также можно указать доступный Home Assistant путь к изображению в параметре `image`.

Параметры кнопки:
- `x`, `y` — положение центра зоны в процентах от ширины и высоты изображения;
- `size` — диаметр зоны нажатия в процентах от ширины изображения;
- `name` — название зоны и подсказка;
- `tap_action` — действие при нажатии;
- `entity` — сущность для действий `toggle` и `more-info`.

Пример:

```yaml
type: custom:remote-map-card
mode: image
image: /local/remote-control.png
buttons:
  - name: Питание
    x: 50
    y: 12
    size: 9
    tap_action:
      action: perform-action
      perform_action: media_player.toggle
      target:
        entity_id: media_player.living_room_tv
```

## Действия при нажатии

Карточка обрабатывает следующие значения `tap_action.action`:

| Действие | Поведение |
| --- | --- |
| `none` | Ничего не делать |
| `perform-action` | Выполнить действие Home Assistant |
| `call-service` | Вызвать сервис (совместимый старый формат) |
| `toggle` | Переключить указанную сущность |
| `more-info` | Открыть диалог информации о сущности |
| `navigate` | Перейти по внутреннему пути Home Assistant |
| `url` | Открыть URL в новой вкладке |

Для `toggle` и `more-info` укажите `entity` в настройках кнопки.

## Отладка и размещение кнопок

- Включите **Показывать зоны нажатия на карточке**, чтобы увидеть активные области в готовой карточке.
- В редакторе перетаскивайте кнопки для изменения положения.
- Используйте синий маркер для изменения размера.
- Двойной щелчок по свободному месту добавляет кнопку.
- При пересечении зон редактор показывает предупреждение. В общей области сработает верхняя зона.
- В режиме нарисованного пульта можно включить сетку, привязку и направляющие. Клавиши со стрелками перемещают выбранную кнопку; Shift увеличивает шаг перемещения, Alt временно отключает привязку при перетаскивании.

## Обратная связь

Сообщения об ошибках и предложения по улучшению оставляйте в [Issues](https://github.com/alshevskij/lovelace-remote-map-card/issues).

## Лицензия

Проект распространяется по лицензии [MIT](LICENSE).
