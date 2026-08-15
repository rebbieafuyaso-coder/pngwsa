import {Layout} from 'antd'
const {Content} = Layout;

import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function AppLayout({children}){
  return(
    <>
      <AppHeader />
      <Content>
        {children}
      </Content>
      <AppFooter />
    </>
  )
}