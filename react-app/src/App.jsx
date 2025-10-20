import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import "./App.css";

function App() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    axios.get(API_BASE_URL).then((response) => {
      console.log(response.data);
      setTeams(response.data.teams);
    });
  }, []);

  const filteredTeams = teams.filter((team) =>
    team.strTeam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (team) => {
    setSelectedTeam(team);
  };

  const closeModal = () => {
    setSelectedTeam(null);
  };

  return (
    <div className="container">
      <h1 className="title">Premier Leage Teams</h1>

      {/*Input pencarian */}
      <input
        type="text"
        placeholder="Cari tim..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />

      <div className="team-grid">
        {filteredTeams.map((team) => (
          <div key={team.idTeam} className="team-card">
            {team.strBadge ? (
              <img src={team.strBadge} alt={team.strTeam} className="team-logo" />
            ) : (
              <p>No logo</p>
            )}
            <h3>{team.strTeam}</h3>
            <p><strong>Stadion:</strong> {team.strStadium}</p>

            {/*tampilkan hanya sebagian deskripsi */}
            <p>
              <strong>Deskripsi:</strong>{" "}
              {team.strDescriptionEN
                ? team.strDescriptionEN.substring(0, 100) + "..."
                : "Tidak ada deskripsi"}
            </p>

            {team.strDescriptionEN && team.strDescriptionEN.length > 100 && (
              <button className="see-more" onClick={() => openModal(team)}>
                Lihat selengkapnya
              </button>
            )}

            {team.strWebsite && (
              <a
                href={`https://${team.strWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="website-link"
              >
                Kunjungi Website
              </a>
            )}
          </div>
        ))}
      </div>

      {/*Modal pop-up */}
      {selectedTeam && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>

            <h2>{selectedTeam.strTeam}</h2>
            <p><strong>Stadion:</strong> {selectedTeam.strStadium}</p>

            <img
              src={selectedTeam.strBadge}
              alt={selectedTeam.strTeam}
              className="modal-logo"
            />

            <p className="modal-description">{selectedTeam.strDescriptionEN}</p>


            {/*Tombol Kembali */}
            <button className="back-button" onClick={closeModal}>
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
