import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import App from "../App";

// Mock axios agar tidak benar-benar memanggil API
vi.mock("axios");

describe("🧩 White Box System Test for App.jsx", () => {

  it("WB-01: should call axios.get once when mounted", async () => {
    const mockTeams = {
      data: {
        teams: [
          { idTeam: "1", strTeam: "Chelsea", strBadge: "logo.png", strStadium: "Stamford Bridge", strDeskripsi: "Club from London" },
          { idTeam: "2", strTeam: "Arsenal", strBadge: "ars.png", strStadium: "Emirates", strDeskripsi: "Another London club" },
        ],
      },
    };

    axios.get.mockResolvedValueOnce(mockTeams);

    render(<App />);

    // Pastikan axios.get hanya dipanggil sekali
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Cek data tampil
    expect(await screen.findByText(/Chelsea/i)).toBeInTheDocument();
  });

  it("WB-02: should filter team based on searchTerm", async () => {
    const mockTeams = {
      data: {
        teams: [
          { idTeam: "1", strTeam: "Chelsea", strBadge: "logo.png", strStadium: "Stamford Bridge" },
          { idTeam: "2", strTeam: "Arsenal", strBadge: "ars.png", strStadium: "Emirates" },
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockTeams);

    render(<App />);

    // Tunggu data muncul
    await waitFor(() => screen.getByText("Chelsea"));

    const input = screen.getByPlaceholderText("Cari tim...");
    fireEvent.change(input, { target: { value: "che" } });

    expect(screen.queryByText(/Arsenal/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Chelsea/i)).toBeInTheDocument();
  });

  it("OTM-02: should handle axios error properly", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<App />);

    // Pastikan error di-handle
    await waitFor(() => {
      // Bisa disesuaikan tergantung UI kamu — apakah muncul "Error" atau hanya console.log
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    // Jika App menampilkan error di layar, cek tampilannya
    const errorText = screen.queryByText(/Error/i) || screen.queryByText(/Network Error/i);
    expect(errorText).toBeTruthy();
  });
});
