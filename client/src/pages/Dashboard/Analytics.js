
import React, { useState, useEffect } from "react";
import Header from "../../components/shared/Layout/Header";
import API from "../../services/API";
import moment from "moment";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");

      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodGroupData();
  }, []);

  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");

      if (data?.success) {
        setInventoryData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  return (
    <>
      <Header />

      <main className="analytics-page">
        <div className="analytics-heading">
          <h2>Blood Inventory Overview</h2>
          <p>Monitor blood availability and recent transactions.</p>
        </div>

        <section className="blood-group-grid">
          {data?.map((record) => (
            <div className="blood-group-card" key={record.bloodGroup}>
              <div className="blood-card-top">
                <span className="blood-card-label">Blood Group</span>
                <span className="blood-group-badge">
                  {record.bloodGroup}
                </span>
              </div>

              <div className="blood-card-stats">
                <div className="blood-stat">
                  <span>Total In</span>
                  <strong>{record.totalIn} <small>ML</small></strong>
                </div>

                <div className="blood-stat">
                  <span>Total Out</span>
                  <strong>{record.totalOut} <small>ML</small></strong>
                </div>
              </div>

              <div className="blood-available">
                <span>Available Blood</span>
                <strong>
                  {record.availableBlood} <small>ML</small>
                </strong>
              </div>
            </div>
          ))}
        </section>

        <section className="transactions-section">
          <div className="transactions-heading">
            <div>
              <h3>Recent Blood Transactions</h3>
              <p>Latest blood inventory activity</p>
            </div>

            <span className="transaction-count">
              {inventoryData.length} Records
            </span>
          </div>

          <div className="table-responsive">
            <table className="table analytics-table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Inventory Type</th>
                  <th>Quantity</th>
                  <th>Donor Email</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>

              <tbody>
                {inventoryData?.length > 0 ? (
                  inventoryData.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <span className="transaction-blood-group">
                          {record.bloodGroup}
                        </span>
                      </td>
                      <td>{record.inventoryType}</td>
                      <td>{record.quantity} ML</td>
                      <td>{record.email}</td>
                      <td>
                        {moment(record.createdAt).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-transactions">
                      No blood transactions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
};

export default Analytics;
