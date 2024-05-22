document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const distanceInput = document.getElementById('distance');
    const distanceUnit = document.getElementById('distance-unit');
    const commonDistances = document.getElementById('common-distances');
    const paceInput = document.getElementById('pace');
    const paceUnit = document.getElementById('pace-unit');

    const calculateTimeButton = document.getElementById('calculate-time');
    const calculateDistanceButton = document.getElementById('calculate-distance');
    const calculatePaceButton = document.getElementById('calculate-pace');

    commonDistances.addEventListener('change', () => {
        const selectedDistance = parseFloat(commonDistances.value);
        if (selectedDistance) {
            const unit = distanceUnit.value;
            const convertedDistance = unit === 'km' ? selectedDistance : convertKmToMiles(selectedDistance);
            distanceInput.value = convertedDistance.toFixed(2);
        }
    });

    distanceUnit.addEventListener('change', () => {
        const distance = parseFloat(distanceInput.value);
        if (distance) {
            if (distanceUnit.value === 'km') {
                distanceInput.value = convertMilesToKm(distance).toFixed(2);
            } else {
                distanceInput.value = convertKmToMiles(distance).toFixed(2);
            }
        }
    });

    calculateTimeButton.addEventListener('click', () => {
        const distance = parseFloat(distanceInput.value);
        const pace = parsePace(paceInput.value);

        if (distance && pace) {
            const timeInSeconds = distance * pace;
            const { hours, minutes, seconds } = secondsToHMS(timeInSeconds);
            hoursInput.value = pad(hours);
            minutesInput.value = pad(minutes);
            secondsInput.value = pad(seconds);
        } else {
            alert('Please enter valid distance and pace.');
        }
    });

    calculateDistanceButton.addEventListener('click', () => {
        const time = parseTime();
        const pace = parsePace(paceInput.value);

        if (time && pace) {
            const distance = time / pace;
            distanceInput.value = distance.toFixed(2);
        } else {
            alert('Please enter valid time and pace.');
        }
    });

    calculatePaceButton.addEventListener('click', () => {
        const time = parseTime();
        const distance = parseFloat(distanceInput.value);

        if (time && distance) {
            const paceInSeconds = time / distance;
            paceInput.value = formatPace(paceInSeconds);
        } else {
            alert('Please enter valid time and distance.');
        }
    });

    function parseTime() {
        const hours = parseInt(hoursInput.value || '0', 10);
        const minutes = parseInt(minutesInput.value || '0', 10);
        const seconds = parseInt(secondsInput.value || '0', 10);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    function parsePace(paceStr) {
        const parts = paceStr.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            const unitFactor = paceUnit.value === 'mile' ? 1.60934 : 1; // Convert miles to km if needed
            return (minutes * 60 + seconds) * unitFactor;
        }
        return null;
    }

    function formatTime(seconds) {
        const { hours, minutes, seconds: remainingSeconds } = secondsToHMS(seconds);
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
    }

    function formatPace(seconds) {
        const { minutes, seconds: remainingSeconds } = secondsToHMS(seconds);
        const roundedSeconds = remainingSeconds.toFixed(2);
        const secondsString = roundedSeconds === '0.00' ? '00' : pad(roundedSeconds);
        return `${pad(minutes)}:${secondsString}`;
    }

    function secondsToHMS(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return { hours, minutes, seconds: remainingSeconds };
    }

    function pad(number) {
        const numStr = number.toString();
        return numStr.length === 1 ? `0${numStr}` : numStr;
    }

    function convertMilesToKm(miles) {
        return miles * 1.60934;
    }

    function convertKmToMiles(km) {
        return km / 1.60934;
    }
});