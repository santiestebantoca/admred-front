import { Dialog, DialogHeader, DialogBody, DialogFooter } from './dialog/index'
import Offcanvas from './Offcanvas.vue'
import Spinner from './Spinner.vue'
import Toast from './Toast.vue'
import { Tab, Tabs, TabContent, TabPane } from './tab/index'
import { Carousel, CarouselItem } from './carousel/index'
import Tooltip from './Tooltip.vue'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from './dropdown/index'
import { Table, TableTh, TableScroller } from './table/index'
import Badge from './Badge.vue'
import {
  Button, ButtonBack, ButtonMenu, ButtonPgUp, ButtonPgDown, ButtonCaret, ButtonFooter, ButtonClose, ButtonCollapse, ButtonIcon,
  ButtonSave, ButtonCancel, ButtonSaveCancel, ButtonAccept, ButtonSend, ButtonReset
} from './button/index'
import Collapse from './Collapse.vue'
import Icon from './icons/Icon.vue'
import { Checkbox, Switch, Radio, Select } from './form/index'
import Popover from './Popover.vue'
import { List, ListHeader } from './list/index'
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, AccordionButton } from './accordion/index'

export default {
  install(app) {
    // bs-accordion
    app.component('bsAccordion', Accordion)
    app.component('bsAccordionItem', AccordionItem)
    app.component('bsAccordionHeader', AccordionHeader)
    app.component('bsAccordionBody', AccordionBody)
    app.component('bsAccordionButton', AccordionButton)
    app.component('bsAccordionBtn', AccordionButton) // Alias
    // bs-btn
    app.component('bsBtn', Button)
    app.component('bsBtnBack', ButtonBack)
    app.component('bsBtnMenu', ButtonMenu)
    app.component('bsBtnPgUp', ButtonPgUp)
    app.component('bsBtnPgDown', ButtonPgDown)
    app.component('bsBtnCaret', ButtonCaret)
    app.component('bsBtnFooter', ButtonFooter)
    app.component('bsBtnClose', ButtonClose)
    app.component('bsBtnCollapse', ButtonCollapse)
    app.component('bsBtnIcon', ButtonIcon)
    app.component('bsBtnSave', ButtonSave)
    app.component('bsBtnCancel', ButtonCancel)
    app.component('bsBtnSaveCancel', ButtonSaveCancel)
    app.component('bsBtnAccept', ButtonAccept)
    app.component('bsBtnSend', ButtonSend)
    app.component('bsBtnReset', ButtonReset)
    // bs-dialog
    app.component('bsDialog', Dialog)
    app.component('bsDialogHeader', DialogHeader)
    app.component('bsDialogBody', DialogBody)
    app.component('bsDialogFooter', DialogFooter)
    // bs-tab
    app.component('bsTabContent', TabContent)
    app.component('bsTabPane', TabPane)
    app.component('bsTabs', Tabs)
    app.component('bsTab', Tab)
    // bs-carousel
    app.component('bsCarousel', Carousel)
    app.component('bsCarouselItem', CarouselItem)
    // bs-dropdown
    app.component('bsDropdown', Dropdown)
    app.component('bsDropdownToggle', DropdownToggle)
    app.component('bsDropdownMenu', DropdownMenu)
    app.component('bsDropdownItem', DropdownItem)
    // bs-table
    app.component('bsTable', Table)
    app.component('bsTableTh', TableTh)
    app.component('bsTableScroller', TableScroller)
    // bs-icon
    app.component('bsIcon', Icon)
    // bs-*
    app.component('bsOffcanvas', Offcanvas)
    app.component('bsSpinner', Spinner)
    app.component('bsToast', Toast)
    app.component('bsTooltip', Tooltip)
    app.component('bsBadge', Badge)
    app.component('bsCollapse', Collapse)
    app.component('bsPopover', Popover)
    // form
    app.component('bsCheckbox', Checkbox)
    app.component('bsSwitch', Switch)
    app.component('bsRadio', Radio)
    app.component('bsSelect', Select)
    // list
    app.component('bsList', List)
    app.component('bsListHeader', ListHeader)
  }
}
