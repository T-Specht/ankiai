import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const NavBar = (props: { children?: React.ReactNode }) => {
  return (
    <div className="flex border-b dark:border-neutral fixed w-full top-0 left-0 bg-base-100 z-20">
      <div className="flex gap-2 p-2 px-4 mx-auto container flex-wrap">
        <Link to="/" className="[&.active]:font-bold">
          CardCreator
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/settings" className="[&.active]:font-bold">
          Settings
        </Link>
        {props.children}
      </div>
    </div>
  );
};

export const Container = (props: { children: React.ReactNode }) => {
  return <div className="container p-4 mx-auto mt-16">{props.children}</div>;
};

export const Route = createFileRoute("/_with_navbar")({
  component: Layout,
});

function Layout() {
  return (
    <>
      <NavBar></NavBar>

      <Container>
        <Outlet></Outlet>
      </Container>
    </>
  );
}
