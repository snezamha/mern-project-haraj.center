import Footer from './Footer';
import NavBar from './NavBar';
import SectionContainer from './SectionContainer';
export default function Layout({ children }) {
  return (
    <div>
      <SectionContainer>
        <NavBar />
        <div className="mx-6">
          <main className="mx-auto my-5">{children}</main>
          <Footer />
        </div>
      </SectionContainer>
    </div>
  );
}
