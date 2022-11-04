type Props = {
  jwt: string;
};

const Dashboard = ({ jwt }: Props) => {
  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <section>
      <h1>Dashboard</h1>

      <h2>Rules</h2>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque eum
        consectetur temporibus! Saepe tempore assumenda numquam quaerat ducimus
        ullam. Voluptas illum suscipit modi placeat delectus veritatis soluta
        illo culpa ratione veniam fugit obcaecati assumenda doloribus dolorum
        magni voluptatum, nam non nemo odit vitae. Culpa sed beatae tempora
        perspiciatis perferendis? Recusandae.
      </p>

      <h2>Coins</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt veniam
        voluptatem suscipit atque vero saepe itaque explicabo doloremque ipsum
        earum laudantium, facilis perspiciatis impedit animi rem unde laborum
        quo sint! Fugiat aut cupiditate eius sit placeat architecto sed illum?
        Ad.
      </p>
    </section>
  );
};

export default Dashboard;
