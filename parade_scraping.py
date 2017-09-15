
# coding: utf-8

# In[2]:

from urllib.request import urlopen
import bs4 # BeautifulSoup: module to parse HTML and XML
import csv


# In[6]:

state_region_dict = {}
with open('census-key.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        state_region_dict[row['State Code']] = row['Region']


# In[7]:

years = []

for year in range(1963, 2014):
    url = 'http://www.ahsfhs.org/Articles/parade1.asp?year={}'.format(year)
    x = urlopen(url)
    html = x.read()
    x.close()
    soup = bs4.BeautifulSoup(html, 'html.parser')
    rows = soup.select('td.smcenter')
    total_players = 0
    region_count = {'Year': year, 'South': 0, 'Northeast': 0, 'Midwest': 0, 'West': 0}
    for r in rows[2::3]:
        region = state_region_dict[r.getText()]
        region_count[region] = region_count[region] + 1
        total_players = total_players + 1
    for key in region_count:
        if key != 'Year':
            region_count[key] = region_count[key] / total_players
    years.append(region_count)


# In[8]:

import csv

with open('region_data.csv', 'w') as csvfile:
    fieldnames = ['Year', 'South', 'Northeast', 'Midwest', 'West']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for y in years:
        writer.writerow(y)


# In[ ]:



