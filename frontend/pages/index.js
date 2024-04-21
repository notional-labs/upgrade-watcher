import { Table } from "antd";
import moment from 'moment';

const fetch_upgrades = async () => {
  const response = await fetch(`http://localhost:8800/list`);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }

  throw new Error("fetch_proposal error");
}

export async function getServerSideProps(ctx) {
  const res = await fetch_upgrades();
  return {props: {...res}};
}


const DataTable = (props) => {
  // console.log(JSON.stringify(props));
  const {data} = props;
  const dataSrc = [];
  for (const item of data) {
    dataSrc.push({key: item.id, ...item});
  }

  return (
    <Table
      columns={[
        {
          title: 'chain',
          dataIndex: 'chain',
          key: 'chain',
          render: (text) => <>{text}</>,
        },
        {
          title: 'name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <>{text}</>,
        },
        {
          title: 'height',
          dataIndex: 'height',
          key: 'height',
          render: (text) => <>{text}</>,
        },
        {
          title: 'time',
          dataIndex: 'time',
          key: 'time',
          render: (text, record) => <>{moment(record.estimated_time, moment.ISO_8601).fromNow()}</>,
        },
      ]}
      dataSource={dataSrc}
      pagination={false}
    />
  );
}

export default function Home(props) {
  const {status, data} = props;
  if (status === "error") {
    return (
      <>
        Error!
      </>
    );
  }

  return (
    <>
      <DataTable data={data} />
    </>
  )
}
