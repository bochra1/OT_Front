import Container from "./Container";
import Mail from "../assets/mail.png";
import { colors } from "../theme/colors";

const Footer = () => {
  return (
    <footer className="px-8 py-5 mt-5" style={{ backgroundColor: colors.secondary[900], color: colors.secondary[100] }}>
      <Container>
        <div className="grid md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-semibold mb-2" style={{ color: colors.primary[500] }}>
              OT —  System Management
            </h3>
         
          </div>


          <div>
            <h4 className="font-semibold mb-2" style={{ color: colors.primary[500] }}>Information</h4>
            <ul className="space-y-1 text-sm">
              <li className="cursor-pointer hover:underline" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = colors.primary[500]} onMouseLeave={(e) => e.target.style.color = colors.secondary[100]}>Privacy Policy</li>
              <li className="cursor-pointer hover:underline" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = colors.primary[500]} onMouseLeave={(e) => e.target.style.color = colors.secondary[100]}>Terms & Conditions</li>

            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2" style={{ color: colors.secondary[500] }}>Social Links</h4>
            <ul className="space-y-1 text-sm">
           
              <li className="flex items-center gap-2 cursor-pointer hover:underline" style={{ transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = colors.primary[500]} onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary[100]}>
                <img src={Mail} alt="E-mail" className="w-5 h-5" />
                support@cst.com
              </li>
            </ul>
          </div>
        </div>
        <div className="text-left md:text-center text-sm mt-8" style={{ color: colors.secondary[400], borderTop: `1px solid ${colors.secondary[700]}`, paddingTop: '1.5rem' }}>
          © 2026 OT — System Management.
          <br className="block md:hidden" /> All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;