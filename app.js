document.addEventListener('DOMContentLoaded', (event) => {
    const dataDiv = document.getElementById('data');
    
    const fetchData = () => {
      fetch('http://192.168.4.1/data')
        .then(response => {
          console.log('Fetch Response:', response);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched Data:', data);
          dataDiv.textContent = `Sensor Value: ${data.sensorValue}`;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          dataDiv.textContent = 'Error fetching data';
        });
    };
    
    const sendCommand = (command) => {
      fetch('http://192.168.4.1/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `command=${command}`
      })
      .then(response => {
        console.log('Command Response:', response);
        return response.text();
      })
      .then(data => {
        console.log('Command Result:', data);
      })
      .catch(error => {
        console.error('Error sending command:', error);
      });
    };
  
    document.getElementById('arm').addEventListener('click', () => {
      sendCommand('arm');
    });
  
    document.getElementById('disarm').addEventListener('click', () => {
      sendCommand('disarm');
    });
  
    document.getElementById('testservo').addEventListener('click', () => {
      sendCommand('testservo');
    });
  
    fetchData();
    setInterval(fetchData, 100);
  
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  });

/*
document.addEventListener('DOMContentLoaded', (event) => {
  const dataDiv = document.getElementById('data');
  let bluetoothDevice;
  let server;
  let characteristic;

  const connectBluetooth = async () => {
    try {
      bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // UUID of the service
      });
      server = await bluetoothDevice.gatt.connect();
      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb'); // UUID of the service
      characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb'); // UUID of the characteristic
      console.log('Bluetooth device connected');
    } catch (error) {
      console.error('Bluetooth connection failed', error);
    }
  };

  const sendCommand = async (command) => {
    if (!characteristic) {
      console.error('No Bluetooth characteristic found');
      return;
    }
    const encoder = new TextEncoder();
    const value = encoder.encode(command);
    await characteristic.writeValue(value);
  };

  const fetchData = async () => {
    if (!characteristic) {
      console.error('No Bluetooth characteristic found');
      return;
    }
    const encoder = new TextEncoder();
    const value = encoder.encode('getData');
    await characteristic.writeValue(value);
    characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const decoder = new TextDecoder();
      const value = event.target.value;
      const decodedValue = decoder.decode(value);
      console.log('Received data:', decodedValue);
      dataDiv.textContent = `Sensor Value: ${JSON.parse(decodedValue).sensorValue}`;
    });
  };

  document.getElementById('arm').addEventListener('click', () => {
    sendCommand('command:arm');
  });

  document.getElementById('disarm').addEventListener('click', () => {
    sendCommand('command:disarm');
  });

  document.getElementById('testservo').addEventListener('click', () => {
    sendCommand('command:testservo');
  });

  document.getElementById('connect').addEventListener('click', () => {
    connectBluetooth();
  });

  setInterval(fetchData, 100);
});
*/