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
import tensorflow as tf
from tensorflow.keras import Input, Model
from tensorflow.keras.models import Sequential, model_from_json
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.preprocessing import sequence
from sklearn import preprocessing
import matplotlib.pyplot as plt
import numpy as np
import pandas# ONLY USED FOR CSV<REPLACE
import datetime
# Following lines needed for gpu training
physical_devices = tf.config.list_physical_devices('GPU')
tf.config.experimental.set_memory_growth(physical_devices[0], enable=True)

date = datetime.datetime.now()
formatdate = date.strftime('%Y_%m_%d_%H_%M')

'''
Train Control Variables
'''
runtitle    = "name of the attempt for graph"
features    = 8 # Input variables in a timestep
num_steps   = 5 # How many timesteps to consider at once
num_batches = 240
num_epochs  = 1 #50 
# NOTE Always check if you're training with proper data
train_file = 'olddata/Jan_interpolated.csv' # Just Jan for fast proto
test_file = 'olddata/Feb_interpolated.csv'  # Just Feb for fast proto
#train_file  = 'olddata/2019_Interpolated_Data.csv'# All 2019 (SLOW)
#test_file  = 'olddata/2018_Interpolated_Data.csv' # All 2018 (SLOW)
''' File Control '''
# Choose to load a model to continue training
load_model = False
load_model_file = 'models/Power_Pred_model_2020_10_05_16_17.json'
load_weight_file = 'weights/Power_Pred_weights_2020_10_05_16_17.h5'
load_history_file = 'history/Power_Pred_history_2020_10_05_16_17.csv'
model_file  = 'models/Power_Pred_model_' + formatdate + '.json'
weight_file = 'weights/Power_Pred_weights_' + formatdate + '.h5'
history_file = 'history/Power_Pred_his_' + formatdate + '.csv'

'''
Form the training data and testing data #
 Load from csv, Sum total power output,
 convert Temperature to Celsius and Wind Speed to m/s
 Get Time of year/day data 
'''
# NOTE Power data headers altered to remove special characters.
def file_to_data(csv):
    #TODO uses pandas to open a csv, when next changing data, use csv api
    loadcsv = pandas.read_csv(csv)
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
        # Sub Note: That margin of safety should be checked for
        # its effects on accuracy 
    GHI_SCALAR = 1875.0   # W/m
    WINDDIR_SCALAR = 360.0# deg
    WINDSPD_SCALAR = 21.0 # mps (?)
    AMBTEMP_SCALAR = 58.0 # C
    POWER_SCALAR = 6470.0 # kWac

    scaled_GHI = GHI_data / GHI_SCALAR
    scaled_windDir = windDir_data / WINDDIR_SCALAR
    scaled_windSpd = windSpd_data / WINDSPD_SCALAR
    scaled_temp = ambTemp_data / AMBTEMP_SCALAR
    scaled_power = power_output / POWER_SCALAR


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


    # How to format data for the network
def toTimeSeries(inputData, timesteps, batches=-1, start=0):
    ''' Data must be formatted in time series:
    data = [0,1,2,3,4,5] becomes [[0,1,2,3], [1,2,3,4], [2,3,4,5]]
    timesteps determines the size of the window, in the example it's 4
    Use start to offset beginning, and batches to choose how many 
    minutes to use beyond start
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


'''
Build the Model
'''
if load_model:
    # LOAD FROM DISK
    json_file = open(load_model_file, 'r')
    loaded_model = json_file.read()
    json_file.close()
    model = model_from_json(loaded_model)
    model.load_weights(load_weight_file)
    print("Loaded model from disk")
else:
    inputs = Input(shape=(num_steps,features))
    lstm1 = LSTM(features, input_shape = (num_steps,features),
        return_sequences=True)(inputs)
    drops = Dropout(.2)(lstm1) # todo evaluate
    lstm2 = LSTM(12, input_shape = (num_steps,features),
        return_sequences=True)(drops)
    outputs = Dense(features+1, activation='tanh')(lstm2)
    model = Model(inputs=inputs, outputs=outputs)
    print("New model instance")

model.compile(loss='mean_squared_error', optimizer='adam') # Evaluate rmsprop
model.summary()

#Dynamic learning rate scheduler
#From https://machinelearningmastery.com/using-learning-rate-schedules-deep-learning-models-python-keras/
def step_decay(epoch):
    initial_lrate = 0.1
    epochs_drop = 10.0
    lrate = initial_lrate * math.pow(drop, math.floor((1+epoch)/epochs_drop))
    return lrate


# Train the model
# Done as loop to ensure states don't bleed through end of epochs
# Keeps internal "memory" chronological
loss_train = []
loss_val = []
graphepochs = range(1,num_epochs+1)
for e in range(num_epochs):
    print("Epoch ", e, " / ", num_epochs)
    # TODO set learning rate
    # Look into "dynamic learning rate"
    history = model.fit(x_train,y_train, epochs=1,
            batch_size=num_batches, shuffle=False,
            validation_data=(x_test,y_test))
    #print("KEYS:")
    #print(history.history.keys())
    loss_train.append(history.history['loss'])
    loss_val.append(history.history['val_loss'])
    model.reset_states()

# Make graphs of training info
plt.figure(0)
plt.plot(graphepochs, loss_train, 'b', label='Training Loss')
plt.plot(graphepochs, loss_val, 'r', label='Validation Loss')
plt.title(runtitle)
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Plot the derivative of the loss
d_dt_train_loss = []
d_dt_val_loss = []
for t in range(1,len(loss_val)):
    d_dt_train_loss.append(loss_train[t] - loss_train[t-1])
    d_dt_val_loss.append(loss_val[t] - loss_val[t-1])
plt.figure(1)
plt.plot(graphepochs, d_dt_train_loss, 'g', label='d/dt(Train Loss)')
plt.plot(graphepochs, d_dt_val_loss, 'y', label='d/dt(Validation Loss)')
plt.title("d/dt(",runtitle,")")
plt.xlabel('Epochs')
plt.ylabel('d/dt(Loss)')
plt.legend()
plt.show()

# Evaulate the model
score = model.evaluate(x_test,y_test, verbose = 0)
print('Test Loss:', score)

# Save model to files in header
model_json = model.to_json()
with open(model_file, 'w') as json_file:
    json_file.write(model_json)
model.save_weights(weight_file)
# Write down the name of the best model so far for backup
print("Saved model to disk")
print("Model: " + model_file)
print("Weight: " + weight_file)
print("History: " + history_file)

#Save the history for expanding or transfer learning models




''' LOAD FROM DISK
json_file = open(model_file, 'r')
loaded_model = json_file_read()
json_file.close()
model = model_from_json(loaded_model)
model.load_weights(weight_file)
print("Loaded model from disk")
'''
        
