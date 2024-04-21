import Head from 'next/head';
import { Layout} from 'antd';
import { MainHeader } from './main_header';
import { MainFooter } from './main_footer';

const {Content} = Layout;

export default function MainLayout({children}) {
  return (
    <Layout className="layout">
      <Head>
        <title>UpgradeWatcher</title>
        <link rel="icon" href={"/favicon.ico"}/>
        <meta
          name="description"
          content="Notional Api"
        />
        <meta
          property="og:image"
          content="test content"
        />
        <meta name="og:title" content="UpgradeWatcher"/>
        <meta name="twitter:card" content="summary_large_image"/>
      </Head>

      <MainHeader />

      <Content style={{padding: '0'}}>
        <div style={{ minHeight: '280px', padding: '24px' }}>
          {children}
        </div>
      </Content>

      <MainFooter />
    </Layout>
  );
}
