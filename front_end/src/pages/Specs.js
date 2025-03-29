import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Specs.css"; // Import custom CSS

const Specs = () => {
  return (
    <div className="container text-center my-5">
      <div className="specs-container">
        <h2>Game Specifications</h2>
        <p>Check if your system meets the requirements to play Valorant.</p>

        {/* System Requirements Table */}
        <div className="table-responsive">
          <table className="table table-dark table-bordered specs-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Minimum</th>
                <th>Recommended</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OS</td>
                <td>Windows 7/8/10 (64-bit)</td>
                <td>Windows 10/11 (64-bit)</td>
              </tr>
              <tr>
                <td>Processor</td>
                <td>Intel Core 2 Duo E8400</td>
                <td>Intel i3-4150 / Ryzen 3 1200</td>
              </tr>
              <tr>
                <td>RAM</td>
                <td>4GB</td>
                <td>8GB</td>
              </tr>
              <tr>
                <td>Graphics</td>
                <td>Intel HD 3000</td>
                <td>GTX 1050 Ti / Radeon R7 370</td>
              </tr>
              <tr>
                <td>VRAM</td>
                <td>1GB</td>
                <td>4GB</td>
              </tr>
              <tr>
                <td>Storage</td>
                <td>10GB available space</td>
                <td>20GB available space</td>
              </tr>
              <tr>
                <td>Internet</td>
                <td>Broadband connection</td>
                <td>Stable high-speed internet</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Note */}
        <p className="specs-note">
          For the best experience, ensure your system is updated with the latest drivers.
        </p>
      </div>
    </div>
  );
};

export default Specs;
