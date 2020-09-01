#!/usr/bin/python3
# Program to Train the Weather Conditions -> Power network
# Uses LSTM with time series formatting
    # ex: [0,1,2,3,4] -> [[0,1,2],[1,2,3],[2,3,4]]
# Each time slice predicts its future state + power at that time
    #
    #   <data1> <data2> <*data3*> <= Predicts 1 beyond its input
    #     ^       ^       ^             -Loop using this data for
    #   [LSTM]->[LSTM]->[LSTM]           further predictions
    #     ^       ^       ^
    #   <data0> <data1> <data2>
    #
# For further help Check 
# https://stackoverflow.com/questions/38714959/understanding-keras-lstms

from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.models import Sequential, model_from_json
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras import Input, Model
from sklearn import preprocessing
import numpy as np
import pandas
import datetime

date = datetime.datetime.now()
formatdate = date.strftime("%Y_%m_%d_%H_%M")

# Train Control Variables
# -------------------------
features    = 8 # Input variables in a timestep
num_steps   = 3 # How many timesteps to consider at once
num_batches = 5
num_epochs  = 2 
# TODO Always check if you're training with proper data
train_file = 'data/Jan_interpolated.csv' # Just Jan for fast proto
test_file = 'data/Feb_interpolated.csv'  # Just Feb for fast proto
#train_file  = 'data/2019_Interpolated_Data.csv'# All 2019 (SLOW)
#test_file  = 'data/2018_Interpolated_Data.csv' # All 2018 (SLOW)
model_file  = 'models/Power_Pred_model_' + formatdate + '.json'
weight_file = 'weights/Power_Pred_weights_' + formatdate + '.h5'


###########################################
# Form the training data and testing data #
###########################################
'''
 Load in the data from the CSV file,
 Sum up the total power output,
 convert Temperature to Celsius and Wind Speed to m/s
 Get Time of year/day data 
'''
# NOTE Power data headers alterred to remove special characters.
def file_to_data(csv):
    loadcsv = pandas.read_csv(csv)           # Month Dataset
    # Sum production meter output
    power_output = loadcsv['LF_Prod1_kWac'].add(loadcsv['LF_Prod2_kWac']) 
    power_output = power_output.add(loadcsv['LF_Prod3_kWac'])
    power_output = power_output.add(loadcsv['LF_Prod4_kWac'])
    GHI_data = loadcsv['LF_WS2_GHI W/m']
    windDir_data = loadcsv['LF_WS1_WindDir']
    def MPHtoMPS(mph):
        return mph * 0.44704
    windSpd_data = loadcsv['LF_WS1_WindSpd mph'].apply(MPHtoMPS)
    def toCelsius(Fahrenheit):
        return (Fahrenheit - 32) / 1.8
    ambTemp_data = loadcsv['LF_WS1_TempAmb F'].apply(toCelsius)
    month = [] ; day = [] ; hour = [] ; minute = []
    for i in range(len(loadcsv)):
        month.append(float(str(loadcsv['Timestamp'][i])[5:7])/12.0)
        day.append(float(str(loadcsv['Timestamp'][i])[8:10])/31.0)
        hour.append(float(str(loadcsv['Timestamp'][i])[11:13])/24.0)
        minute.append(float(str(loadcsv['Timestamp'][i])[14:16])/60.0)


    # NOTE Scaled by values found in findmaxvalues.py for data
    # Scalars are maximums of data file + 30% for safety
        # Sub Note: That margin of safety is being checked for
        # its effects on accuracy
    scaled_GHI = GHI_data / 1875.0
    scaled_windDir = windDir_data / 360.0
    scaled_windSpd = windSpd_data / 21.0
    scaled_temp = ambTemp_data / 58.0
    scaled_power = power_output / 6470.0


    # NOTE NOTE Here is where the data is organized into how it
    # will train and predict. New data sources are added here
    # (After being scaled to between 0 and 1) in the above 

    # NOTE the power data is not available continuously,
    # can not have power as an input parameter.
    # np.c_ appends columns, change this to add/remove features
    input_data = np.c_[scaled_GHI,scaled_windDir,scaled_windSpd,
            scaled_temp,month,day,hour,minute]
    output_data = np.c_[scaled_GHI,scaled_windDir,scaled_windSpd,
            scaled_temp,month,day,hour,minute,scaled_power]
    return input_data, output_data



def toTimeSeries(inputData, timesteps, batches=-1, start=0):
    ''' Data must be formatted in time series:
    data = [0,1,2,3,4,5] becomes [[0,1,2,3], [1,2,3,4], [2,3,4,5]]
    timesteps determines the length, in the example there's 4
    Use start to offset beginning, and batches to choose how many 
    '''
    # Trim if reaches past given data's bounds,
    if ((batches + start > len(inputData) - timesteps - start) or
            (batches < 0)):
         batches = len(inputData) - timesteps - start
    # Build Output
    timeSeries = []
    for t in range(start, start + batches ):
        newRow = []
        for dt in range(timesteps):
            newRow.append(inputData[t + dt])
        timeSeries.append(newRow)
    # Output has shape (batches,timesteps,features)
    return np.array(timeSeries)


# create Training data
# The filenames are specified in header
train_input_data,train_output_data = file_to_data(train_file)
test_input_data,test_output_data = file_to_data(test_file)


# Remember to start y a step ahead to output t+1
# also stop x a step short to make final prediction novel
x_train = toTimeSeries(train_input_data[0:-1], timesteps=num_steps)
y_train = toTimeSeries(train_output_data[1:], timesteps=num_steps)
x_test = toTimeSeries(test_input_data[0:-1], timesteps=num_steps)
y_test = toTimeSeries(test_output_data[1:], timesteps=num_steps)



###################
# Build the Model #
###################

inputs = Input(shape=(num_steps,features))
lstm1 = LSTM(features, input_shape = (num_steps,features), return_sequences=True)(inputs)
#drops = Dropout(.2)(lstm1) # todo evaluate
lstm2 = LSTM(12, input_shape = (num_steps,features), return_sequences=True)(lstm1)
outputs = Dense(features+1, activation='tanh')(lstm2)
model = Model(inputs=inputs, outputs=outputs)
model.compile(loss='mean_squared_error', optimizer='adam')
model.summary()

# Train the model
# Done as loop to ensure states don't bleed through end of epochs
# Keeps internal "memory" chronological
for e in range(num_epochs):
    model.fit(x_train,y_train, epochs=1, batch_size=num_batches, shuffle=False)
    model.reset_states()

# Evaulate the model
score = model.evaluate(x_test,y_test, verbose = 0)
print('Test Loss:', score)

# Save model to JSON
model_json = model.to_json()
with open(model_file, 'w') as json_file:
    json_file.write(model_json)
model.save_weights(weight_file)
# Write down the name of the best model so far for backup
print("Saved model to disk")
print("Model: " + model_file)
print("Weight: " + weight_file)

''' LOAD FROM DISK
json_file = open(model_file, 'r')
loaded_model = json_file_read()
json_file.close()
model = model_from_json(loaded_model)
model.load_weights(weight_file)
print("Loaded model from disk")
'''
        
