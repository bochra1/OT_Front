import React from "react";
import styled from "styled-components";
import { colors, shadows } from "../theme/colors";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="overlay">
        <section className="dots-container">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </section>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${colors.secondary[50]}; /* light background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .dot {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: ${colors.secondary[500]};
    box-shadow: 0 0 0 0 rgba(0, 61, 122, 0.7);
    animation: pulse 1.5s infinite ease-in-out;
  }

  .dot:nth-child(1) {
    animation-delay: -0.3s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.15s;
  }

  .dot:nth-child(3) {
    animation-delay: 0s;
  }

  .dot:nth-child(4) {
    animation-delay: 0.15s;
  }

  .dot:nth-child(5) {
    animation-delay: 0.3s;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      background-color: ${colors.secondary[400]};
      box-shadow: 0 0 0 0 rgba(0, 61, 122, 0.3);
    }

    50% {
      transform: scale(1.3);
      background-color: ${colors.secondary[500]};
      box-shadow: 0 0 0 12px rgba(0, 61, 122, 0);
    }

    100% {
      transform: scale(0.8);
      background-color: ${colors.secondary[400]};
      box-shadow: 0 0 0 0 rgba(0, 61, 122, 0.3);
    }
  }
`;

export default Loader;
