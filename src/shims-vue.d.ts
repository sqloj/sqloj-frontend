/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>

  export interface GlobalComponents {
    NAlert: typeof import('naive-ui')['NAlert']
    NAvatar: typeof import('naive-ui')['NAvatar']
    NBackTop: typeof import('naive-ui')['NBackTop']
    NBadge: typeof import('naive-ui')['NBadge']
    NBreadcrumb: typeof import('naive-ui')['NBreadcrumb']
    NBreadcrumbItem: typeof import('naive-ui')['NBreadcrumbItem']
    NButton: typeof import('naive-ui')['NButton']
    NCard: typeof import('naive-ui')['NCard']
    NCheckbox: typeof import('naive-ui')['NCheckbox']
    NCol: typeof import('naive-ui')['NCol']
    NConfigProvider: typeof import('naive-ui')['NConfigProvider']
    NDialogProvider: typeof import('naive-ui')['NDialogProvider']
    NDivider: typeof import('naive-ui')['NDivider']
    NDrawer: typeof import('naive-ui')['NDrawer']
    NDrawerContent: typeof import('naive-ui')['NDrawerContent']
    NDropdown: typeof import('naive-ui')['NDropdown']
    NForm: typeof import('naive-ui')['NForm']
    NFormItem: typeof import('naive-ui')['NFormItem']
    NGrid: typeof import('naive-ui')['NGrid']
    NGridItem: typeof import('naive-ui')['NGridItem']
    NIcon: typeof import('naive-ui')['NIcon']
    NInput: typeof import('naive-ui')['NInput']
    NLayout: typeof import('naive-ui')['NLayout']
    NLayoutContent: typeof import('naive-ui')['NLayoutContent']
    NLayoutHeader: typeof import('naive-ui')['NLayoutHeader']
    NLayoutSider: typeof import('naive-ui')['NLayoutSider']
    NLoadingBarProvider: typeof import('naive-ui')['NLoadingBarProvider']
    NMenu: typeof import('naive-ui')['NMenu']
    NMessageProvider: typeof import('naive-ui')['NMessageProvider']
    NNotificationProvider: typeof import('naive-ui')['NNotificationProvider']
    NProgress: typeof import('naive-ui')['NProgress']
    NRow: typeof import('naive-ui')['NRow']
    NSelect: typeof import('naive-ui')['NSelect']
    NSkeleton: typeof import('naive-ui')['NSkeleton']
    NSwitch: typeof import('naive-ui')['NSwitch']
    NTabPane: typeof import('naive-ui')['NTabPane']
    NTabs: typeof import('naive-ui')['NTabs']
    NTag: typeof import('naive-ui')['NTag']
    NTooltip: typeof import('naive-ui')['NTooltip']
  }

  export default component
}
