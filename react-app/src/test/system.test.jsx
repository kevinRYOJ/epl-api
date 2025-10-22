import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import App from "../App";

// Mock axios
vi.mock("axios");

describe("🧩 White Box System Test for App.jsx", () => {

  // ✅ reset mock sebelum tiap test
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    // tunggu data muncul
    const chelsea = await screen.findByText(/Chelsea/i);
    expect(chelsea).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledTimes(1);
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

    await screen.findByText("Chelsea");

    const input = screen.getByPlaceholderText("Cari tim...");
    fireEvent.change(input, { target: { value: "che" } });

    expect(screen.queryByText(/Arsenal/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Chelsea/i)).toBeInTheDocument();
  });

  it("WB-03: should handle axios error properly", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<App />);

    // tunggu error muncul di UI
    const errorText = await screen.findByText(/Network Error/i);
    expect(errorText).toBeInTheDocument();

    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
