# QR Code Analytics System - Rosti.hu

## 🎯 Overview

This system tracks visitors who come to your website through QR codes, helping you measure the effectiveness of your physical marketing materials.

## 📊 What We Track

### 1. **Direct Visits to Ingredients Page (`/osszetevok`)**
- **Why**: Your QR code points directly to this page
- **Logic**: Any direct visit (no referrer) to `/osszetevok` is likely from QR code
- **Confidence**: High - there's no link to this page from the main site

### 2. **Direct Visits to Main Page (`/`)**
- **Why**: Some QR codes might point to the homepage
- **Logic**: Direct visits (no referrer) to the main page could be from QR codes
- **Confidence**: Medium - could also be bookmarks, typed URLs, etc.

## 🔧 Technical Implementation

### Client-Side Tracking
- **Location**: `src/lib/analytics.ts`
- **Function**: `trackQRCodeVisit()`
- **Triggers**: Automatically on page load for both pages
- **Session Management**: Uses `sessionStorage` to avoid double-counting

### Server-Side Storage
- **Database Table**: `qr_code_visits`
- **API Endpoint**: `/api/analytics/qr-code`
- **Data Stored**:
  - Page visited
  - Timestamp
  - User agent (device info)
  - IP address
  - Referrer information
  - Session ID

### Admin Dashboard
- **Location**: `/admin/analytics`
- **Features**:
  - Real-time visit counts
  - Time-based filtering (7, 30, 90 days)
  - Device type detection
  - Recent visits list
  - QR effectiveness metrics

## 📈 Analytics Metrics

### Key Performance Indicators (KPIs)

1. **Total QR Visits**: All tracked visits from QR codes
2. **Ingredients Page Direct**: High-confidence QR visits
3. **Homepage Direct**: Possible QR visits to main page
4. **Daily/Weekly/Monthly Trends**: Time-based analysis

### Dashboard Features

- **Real-time Updates**: Refresh to see latest data
- **Time Range Selection**: View data for different periods
- **Device Breakdown**: Mobile, tablet, desktop usage
- **Visit History**: Detailed log of recent visits

## 🎯 How to Use This Data

### 1. **Measure QR Code Effectiveness**
```
QR Effectiveness = (Ingredients Direct Visits / Total Marketing Reach) × 100
```

### 2. **Optimize QR Placement**
- Compare visits before/after QR code placement
- Track which locations generate more scans
- Identify peak scanning times

### 3. **Content Strategy**
- If many visits go to homepage, consider adding QR-specific content
- Use ingredients page data to improve that page's conversion

### 4. **ROI Calculation**
- Track conversions from QR visits
- Calculate cost per QR-generated visit
- Measure customer lifetime value from QR traffic

## 📱 QR Code Best Practices

### 1. **URL Strategy**
- **Current**: QR → `rosti.hu/osszetevok` (trackable)
- **Alternative**: QR → `rosti.hu` (less trackable but broader appeal)
- **Advanced**: Use UTM parameters: `rosti.hu/osszetevok?utm_source=qr&utm_campaign=product_label`

### 2. **Placement Optimization**
- **Product packaging**: High scan rate, engaged audience
- **Posters/flyers**: Medium scan rate, broader reach
- **Business cards**: Low scan rate, but high-intent users

### 3. **Call-to-Action**
- Add text like "Scan to learn about ingredients"
- Include visual cues (phone icon, scan gesture)
- Ensure QR code is large enough (minimum 2cm × 2cm)

## 🔍 Data Analysis Tips

### Daily Monitoring
1. Check `/admin/analytics` daily for new visits
2. Look for patterns in visit times
3. Monitor device types (mobile vs desktop)

### Weekly Analysis
1. Compare week-over-week growth
2. Identify successful marketing campaigns
3. Track conversion rates from QR visits

### Monthly Reporting
1. Calculate QR ROI
2. Plan future QR placements
3. Optimize landing pages based on data

## 🛡️ Privacy & Compliance

### Data Collection
- **IP Addresses**: Stored for analytics, not personally identifiable
- **User Agents**: Device information only
- **Session IDs**: Temporary, for avoiding double-counting
- **No Personal Data**: No emails, names, or personal information

### GDPR Compliance
- Data is anonymized
- No tracking cookies used
- Users can't be personally identified
- Data retention: 90 days (configurable)

## 🚀 Future Enhancements

### Planned Features
1. **Geographic Tracking**: City-level location data
2. **Conversion Tracking**: QR visit → purchase correlation
3. **A/B Testing**: Different QR landing pages
4. **Export Functionality**: CSV/Excel data export
5. **Email Alerts**: Notifications for traffic spikes

### Advanced Analytics
1. **Heat Maps**: Most effective QR placements
2. **Cohort Analysis**: User behavior over time
3. **Attribution Modeling**: QR impact on sales
4. **Predictive Analytics**: Forecast QR performance

## 📞 Support

For questions about the QR analytics system:
1. Check the admin dashboard at `/admin/analytics`
2. Review this documentation
3. Contact your development team for technical issues

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Active and Tracking

