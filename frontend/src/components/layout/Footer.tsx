import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-2 border-top w-100">
      <div className="container-fluid">
        <div className="row align-items-center g-2">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 small text-muted">
              © 2024 College ERP. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="small">
              <a href="#" className="text-decoration-none text-muted me-3">
                Privacy Policy
              </a>
              <a href="#" className="text-decoration-none text-muted me-3">
                Terms of Service
              </a>
              <a href="#" className="text-decoration-none text-muted">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
