# Higher Education Growth Model

Visit our website: [www.edtraverse.com](http://www.edtraverse.com)

The **Higher Education Growth Model** offers cutting-edge insights for stakeholders in the higher education sector. It forecasts the growth or decline of 3,000 colleges based on demographics, selectivity, and academic program attractiveness to students. My goal is to help edtech companies, insurers, lenders, and educational institutions make data-driven decisions about the market.

## Features

- **Tuition Revenue Forecasting**: Utilizes demographic trends, institutional selectivity, and academic program mix to project changes to net tuition and operating revenues.
    - **Demographics**: each school has a unique pipeline of incoming freshman. Some attract students globally, others regionally, and others locally. The US is seeing an overall demographic decline, but some regions and states are growing. Based on where each school attracts students, we can determine their growth/decline.
    - **Selectivity**: elite institutions will continue to meet enrollment targets, and have the ability to lower admissions standards. However, this leaves even fewer students left for less selective schools, worsening the problem. The model iteratively distributes available future students to each school, incorporating selectivity and admissions yield data.
    - **Academic Programs**: to gauge upcoming student demand for specific majors, I've mapped Bureau of Labor Statistics job growth estimates with academic degree programs, differentiating between associates, bachelors, masters, and PhD-level programs. 
- **For Prospective Students/Parents**: Provides a web-app lookup tool to view the prospects of individual colleges. Information is directional/non-precise yet comprehensive, so you can view the overall picture.
- **For Organizations**: For a fee, I provide the full dataset for 3,000 private and public 4-year institutions and community colleges. This can be used to identify segments of growing colleges with increasing budgets to buy your products and services. Also available are more limited peer-grouping analyses.

## Usage

I've open-sourced the base algorithm and the website under the MIT License. However, my data sources for student demographics and selectivity are encrypted.

For full usage, contact me at [dcornett@edtraverse.com](mailto:dcornett@edtraverse.com).

## Built With

- **Python**: Primary programming language.
- **Pandas**: Data manipulation and analysis.
- **Fernet**: Secure data encryption and decryption.
- **Next.js**: React framework for the front-end.

## Deployment

The deployed version separates the front and back end into separate private repositories:

- **Front End**: Deployed on [Vercel](https://vercel.com/).
- **Back End**: Deployed on [Render](https://render.com/).
