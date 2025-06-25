"use client";

import styled from "styled-components";

const VolumeIcon = styled.div`
  width: 20px;
  height: 100%;
  color: var(--color-primary);
  display: flex;
  justify-content: flex-end;
`;

const RangeInput = styled.input.attrs({ type: "range" })`
  //remove baseline styles
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;

  /***** Track Styles *****/
  /***** Chrome, Safari, Opera, and Edge Chromium *****/
  &::-webkit-slider-runnable-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  /******** Firefox ********/
  &&::-moz-range-track {
    background: var(--color-black);
    height: 6px;
    border-radius: 3px;
  }

  &&::-webkit-slider-thumb {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    margin-top: -9px; /* Centers thumb on the track */
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  &&::-moz-range-thumb {
    border: none; /*Removes extra border that FF applies*/
    border-radius: 0; /*Removes default border-radius that FF applies*/
    background-color: var(--color-primary);
    height: 24px;
    width: 12px;
    border-radius: 4px;
  }

  transform: rotate(-90deg);
  width: 60px;
  height: 80px;
  margin-bottom: 40px;
`;

const VolumeIconContainer = styled.div`
  cursor: pointer;
`;

const VolumeControl = ({ handleVolumeChange, volume, handleMute }) => {
  return (
    <>
      <RangeInput
        aria-label="volume"
        type="range"
        min="0"
        max="100"
        onChange={handleVolumeChange}
        value={volume * 100}
      />
      <VolumeIconContainer>
        <VolumeIcon aria-label="mute" onClick={() => handleMute()}>
          {volume < 0.05 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.88889 16H2C1.44772 16 1 15.5523 1 15V9.00001C1 8.44772 1.44772 8.00001 2 8.00001H5.88889L11.1834 3.66815C11.3971 3.49329 11.7121 3.52479 11.887 3.73851C11.9601 3.82784 12 3.93971 12 4.05513V19.9449C12 20.221 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16ZM20.4142 12L23.9497 15.5355L22.5355 16.9498L19 13.4142L15.4645 16.9498L14.0503 15.5355L17.5858 12L14.0503 8.46447L15.4645 7.05026L19 10.5858L22.5355 7.05026L23.9497 8.46447L20.4142 12Z"></path>
            </svg>
          ) : volume < 0.4 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.88889 16H5C4.44772 16 4 15.5523 4 15V9.00001C4 8.44772 4.44772 8.00001 5 8.00001H8.88889L14.1834 3.66815C14.3971 3.49329 14.7121 3.52479 14.887 3.73851C14.9601 3.82784 15 3.93971 15 4.05513V19.9449C15 20.221 14.7761 20.4449 14.5 20.4449C14.3846 20.4449 14.2727 20.405 14.1834 20.3319L8.88889 16ZM18.8631 16.5911L17.4411 15.169C18.3892 14.4376 19 13.2901 19 12C19 10.5697 18.2493 9.31469 17.1203 8.6076L18.5589 7.169C20.0396 8.2616 21 10.0187 21 12C21 13.8422 20.1698 15.4904 18.8631 16.5911Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2 16.0001H5.88889L11.1834 20.3319C11.2727 20.405 11.3846 20.4449 11.5 20.4449C11.7761 20.4449 12 20.2211 12 19.9449V4.05519C12 3.93977 11.9601 3.8279 11.887 3.73857C11.7121 3.52485 11.3971 3.49335 11.1834 3.66821L5.88889 8.00007H2C1.44772 8.00007 1 8.44778 1 9.00007V15.0001C1 15.5524 1.44772 16.0001 2 16.0001ZM23 12C23 15.292 21.5539 18.2463 19.2622 20.2622L17.8445 18.8444C19.7758 17.1937 21 14.7398 21 12C21 9.26016 19.7758 6.80629 17.8445 5.15557L19.2622 3.73779C21.5539 5.75368 23 8.70795 23 12ZM18 12C18 10.0883 17.106 8.38548 15.7133 7.28673L14.2842 8.71584C15.3213 9.43855 16 10.64 16 12C16 13.36 15.3213 14.5614 14.2842 15.2841L15.7133 16.7132C17.106 15.6145 18 13.9116 18 12Z"></path>
            </svg>
          )}
        </VolumeIcon>
      </VolumeIconContainer>
    </>
  );
};
export default VolumeControl;
