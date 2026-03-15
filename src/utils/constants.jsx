export const API_BASE_URL = 'http://localhost:4000/api';

export const DELIVERY_FEES = {
  standard: 2500,
  express:  5000,
  pickup:   0,
};

export const ORDER_STATUSES = {
  pending:    { label: 'Pending',    color: 'yellow' },
  confirmed:  { label: 'Confirmed',  color: 'blue'   },
  processing: { label: 'Processing', color: 'purple' },
  shipped:    { label: 'Shipped',    color: 'orange' },
  delivered:  { label: 'Delivered',  color: 'green'  },
  cancelled:  { label: 'Cancelled',  color: 'red'    },
};

export const PRODUCT_CATEGORIES = [
  { value: 'kits',                label: 'Kits'                },
  { value: 'gym-gear',            label: 'Gym Gear'            },
  { value: 'training-equipment',  label: 'Training Equipment'  },
];