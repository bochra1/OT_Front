import { useState } from "react";
import { useTranslation } from "react-i18next";
import OTForm from "./OTForm";
import { themeStyles, colors } from "../theme/colors";

const Navbar = ({ user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [isOTFormOpen, setIsOTFormOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleOTSubmit = async (formData) => {
    console.log("OT Form Data:", formData);
  };

  return (
    <div className="navbar shadow-lg md:px-8 mb-10" style={themeStyles.navbar.container}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><a>Home</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
        <a className="text-sm md:text-xl font-bold text-nowrap">
          <span style={{ color: themeStyles.heading.color, fontWeight: themeStyles.heading.fontWeight }}>TT</span> — OT System
        </a>
      </div>

      <div className="navbar-end gap-4">
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a
                style={{
                  borderBottom: '2px solid transparent',
                  transition: 'border-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = '#003D7A')}
                onMouseLeave={(e) => (e.target.style.borderColor = 'transparent')}
              >
                Home
              </a>
            </li>
            <li>
              <a
                style={{
                  borderBottom: '2px solid transparent',
                  transition: 'border-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = '#003D7A')}
                onMouseLeave={(e) => (e.target.style.borderColor = 'transparent')}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* User Info */}
        {user && (
          <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: colors.accent[100] }}>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: colors.accent[900] }}>{user.name}</p>
              <p className="text-xs" style={{ color: colors.accent[600] }}>{user.role}</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: colors.secondary[500] }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        )}

        {/* Language Dropdown */}
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-sm btn-outline gap-2 normal-case font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15 15 0 0 1 0 20" />
              <path d="M12 2a15 15 0 0 0 0 20" />
            </svg>

            <span className="text-sm">{i18n.language.toUpperCase()}</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 opacity-60"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>

          <ul tabIndex={0} className="dropdown-content menu mt-2 w-40 rounded-lg bg-base-100 shadow-lg border border-base-200">
            <li>
              <button
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active font-medium' : ''}
              >
                English
              </button>
            </li>
            <li>
              <button
                onClick={() => changeLanguage('fr')}
                className={i18n.language === 'fr' ? 'active font-medium' : ''}
              >
                Français
              </button>
            </li>
          </ul>
        </div>

        {/* New OT Button */}
        <button
          onClick={() => setIsOTFormOpen(true)}
          style={themeStyles.button.primary}
          onMouseEnter={(e) => Object.assign(e.target.style, { ...themeStyles.button.primary, ...themeStyles.button.primaryHover })}
          onMouseLeave={(e) => Object.assign(e.target.style, themeStyles.button.primary)}
        >
          {t('new_ticket')}
        </button>

        {/* Logout Button */}
       
          <button
            onClick={onLogout}
            className="btn btn-sm btn-ghost"
            style={{ color: colors.secondary[500] }}
          >
            Logout
          </button>
     
      </div>

      <OTForm
        isOpen={isOTFormOpen}
        onClose={() => setIsOTFormOpen(false)}
        onSubmit={handleOTSubmit}
      />
    </div>
  );
};

export default Navbar;