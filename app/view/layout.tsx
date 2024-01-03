interface ViewLayoutProps {
  children: React.ReactNode;
}

const ViewLayout = ({ children }: ViewLayoutProps) => (
  <div style={{ padding: 50 }}>{children}</div>
);

export default ViewLayout;
