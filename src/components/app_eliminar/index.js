import { Layout, Header, Footer, PageContainer, Page, Drawer } from './layout/index'

export default {
  install(app) {
    // app-layout
    app.component('appLayout', Layout)
    app.component('appHeader', Header)
    app.component('appFooter', Footer)
    app.component('appPageContainer', PageContainer)
    app.component('appPage', Page)
    app.component('appDrawer', Drawer)
  }
}
