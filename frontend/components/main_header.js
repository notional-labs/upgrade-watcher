import Link from "next/link";
import { Layout } from "antd";

const {Header} = Layout;

export const MainHeader = () => {
  return (
    <Header style={{background: "white"}}>
      <div style={{ float: 'left', width: '160px', height: '31px', fontSize: 'large'}}><Link href='/' style={{ color: '#c4181a' }}>Upgrade Watcher</Link></div>
    </Header>
  );
}
