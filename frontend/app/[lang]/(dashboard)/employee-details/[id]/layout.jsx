import EmployeeLayout from "./employee-layout"

export const metadata = {
  title: "User Profile",
};
const Layout = ({ children }) => {

  return (
    <EmployeeLayout>
      {children}
    </EmployeeLayout>
  )
};

export default Layout;
