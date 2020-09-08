import minimalmodbus as mmbus
import serial
import threading
import time
import pymongo
from datetime import datetime
from pymongo.son_manipulator import SONManipulator

class WeatherData:
	def __init__(self, slrFD_W, rain_mm, strikes, dist_km, ws_ms, windDir, maxWS_ms, airT_C, vp_mmHg, bp_mmHg, rh, rht_c, tiltNS_deg, tiltWE_deg):
		self.slrFD_W = slrFD_W
		self.rain_mm = rain_mm
		self.strikes = strikes
		self.dist_km = dist_km
		self.ws_ms = ws_ms
		self.windDir = windDir
		self.maxWS_ms = maxWS_ms
		self.airT_C = airT_C
		self.vp_mmHg = vp_mmHg
		self.bp_mmHg = bp_mmHg
		self.rh = rh
		self.rht_c = rht_c
		self.tiltNS_deg = tiltNS_deg
		self.tiltWE_deg = tiltWE_deg
		
class Datalogger:
	def __init__(self, path):
		self.ins = mmbus.Instrument(path, 1, mode='rtu')
		self.ins.serial.baudrate = 9600
		self.ins.serial.bytesize = 8
		self.ins.serial.parity = serial.PARITY_NONE
		self.ins.serial.stopbits = 1
		self.ins.serial.timeout = 2
		
	def poll(self):
		slrFD_W = self.ins.read_float(0, functioncode=3, number_of_registers=2, byteorder=0)
		rain_mm = self.ins.read_float(2, functioncode=3, number_of_registers=2, byteorder=0)
		strikes = self.ins.read_float(4, functioncode=3, number_of_registers=2, byteorder=0)
		dist_km = self.ins.read_float(6, functioncode=3, number_of_registers=2, byteorder=0)
		ws_ms = self.ins.read_float(8, functioncode=3, number_of_registers=2, byteorder=0)
		windDir = self.ins.read_float(10, functioncode=3, number_of_registers=2, byteorder=0)
		maxWS_ms = self.ins.read_float(12, functioncode=3, number_of_registers=2, byteorder=0)
		airT_C = self.ins.read_float(14, functioncode=3, number_of_registers=2, byteorder=0)
		vp_mmHg = self.ins.read_float(16, functioncode=3, number_of_registers=2, byteorder=0)
		bp_mmHg = self.ins.read_float(18, functioncode=3, number_of_registers=2, byteorder=0)
		rh = self.ins.read_float(20, functioncode=3, number_of_registers=2, byteorder=0)
		rht_c = self.ins.read_float(22, functioncode=3, number_of_registers=2, byteorder=0)
		tiltNS_deg = self.ins.read_float(24, functioncode=3, number_of_registers=2, byteorder=0)
		tiltWE_deg = self.ins.read_float(26, functioncode=3, number_of_registers=2, byteorder=0)
		
		self.weather_data = WeatherData(slrFD_W, rain_mm, strikes, dist_km, ws_ms, windDir, maxWS_ms, airT_C, vp_mmHg, bp_mmHg, rh, rht_c, tiltNS_deg, tiltWE_deg)
		self.print_data_test()
		
	def print_data_test(self):
		print(str(self.weather_data.slrFD_W))
		print(str(self.weather_data.rain_mm))
		print(str(self.weather_data.strikes))
		print(str(self.weather_data.dist_km))
		print(str(self.weather_data.ws_ms))
		print(str(self.weather_data.windDir))
		print(str(self.weather_data.maxWS_ms))
		print(str(self.weather_data.airT_C))
		print(str(self.weather_data.vp_mmHg))
		print(str(self.weather_data.bp_mmHg))
		print(str(self.weather_data.rh))
		print(str(self.weather_data.rht_c))
		print(str(self.weather_data.tiltNS_deg))
		print(str(self.weather_data.tiltWE_deg))
				
class WeatherDataDBRunner(threading.Thread):
	def __init__(self):
		threading.Thread.__init__(self)
		#setup db here
		print("setup db here")
		self.client = pymongo.MongoClient("mongodb+srv://mainuser:63qRsDFul7udpNDy@cluster0.lgezy.mongodb.net/<dbname>?retryWrites=true&w=majority")
		self.db = self.client.cloudTrackingData
		self.datalogger = Datalogger('/dev/ttyS5') #path will need to change per system
		self.sleep_time = 60 #60 seconds
		
	def run(self):
		while(True):
			self.datalogger.poll()
			# run power prediction here
			# compare data here
			self.send_weather_data_to_db()
			# send verification numbers to db here
			time.sleep(self.sleep_time)
			
	def send_weather_data_to_db(self):
		print("sendind data to db")
		the_date = datetime.utcnow()
		post = {"author": "datalogger",
				"slrFD_W": self.datalogger.weather_data.slrFD_W,
				"rain_mm": self.datalogger.weather_data.rain_mm,
				"strikes": self.datalogger.weather_data.strikes,
				"dist_km": self.datalogger.weather_data.dist_km,
				"ws_ms": self.datalogger.weather_data.ws_ms,
				"windDir": self.datalogger.weather_data.windDir,
				"maxWS_ms": self.datalogger.weather_data.maxWS_ms,
				"airT_C": self.datalogger.weather_data.airT_C,
				"vp_mmHg": self.datalogger.weather_data.vp_mmHg,
				"bp_mmHg": self.datalogger.weather_data.bp_mmHg,
				"rh": self.datalogger.weather_data.rh,
				"rht_c": self.datalogger.weather_data.rht_c,
				"tiltNS_deg": self.datalogger.weather_data.tiltNS_deg,
				"tiltWE_deg": self.datalogger.weather_data.tiltWE_deg,
				"tags": ["weather_data", "datalogger", "weather", "weather_station", "verified_data"],
				"date": the_date,
				"date_mins_only": the_date.replace(second=0, microsecond=0)}
		
		posts = self.db.WeatherData
		post_id = posts.insert_one(post).inserted_id
		print("post_id: " + str(post_id))
		
def main():
	weather_data_db_runner = WeatherDataDBRunner()
	weather_data_db_runner.start()
		
if __name__ == "__main__":
	main()

# Get the instrument from the PC port it's plugged into
# and the modbus device address. Set mode to rtu.
#ins = mmbus.Instrument('/dev/ttyS5', 1, mode='rtu') 

# Just set some properties to match the datalogger
#ins.debug = True
#ins.serial.baudrate = 9600
#ins.serial.bytesize = 8
#ins.serial.parity = serial.PARITY_NONE
#ins.serial.stopbits = 1
#ins.serial.timeout = 2
#print(ins)

# Read 4 registers starting at register 1. There are 2 floats being
# stored, so they use 4 registers in total.
#data = ins.read_registers(1, number_of_registers=2, functioncode=3)
#print('data: ' + str(data))

# read a float starting at register 7. a float uses 2 registers
# the first arguments to read_float is the register number to read
#fl = ins.read_float(12, functioncode=3, number_of_registers=2, byteorder=0)
#print('float ' + str(round(fl, 2)))

