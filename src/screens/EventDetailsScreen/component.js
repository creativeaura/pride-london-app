// @flow
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import type { NavigationScreenProp } from "react-navigation";
import formatDate from "date-fns/format";
import isSameDay from "date-fns/is_same_day";
import Header from "./Header";
import IconItem from "./IconItem";
import CategoryLabel from "./CategoryLabel";
import EventMap from "./EventMap";
import Text from "../../components/Text";
import Button from "../../components/Button";
import {
  eventDetailsBgColor,
  eventDetailsHeaderBgColor
} from "../../constants/colors";
import text from "../../constants/text";
import strings from "../../constants/strings";
import type { Event } from "../../integrations/cms";

const locale = "en-GB";

type Props = {
  navigation: NavigationScreenProp<{ params: { eventId: String } }>,
  event: Event
};

class EventDetailsScreen extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  render() {
    const { event } = this.props;
    const startTime = new Date(this.props.event.fields.startTime[locale]);
    const endTime = new Date(this.props.event.fields.endTime[locale]);
    const dateFormat = "DD MMMM YYYY";
    const timeFormat = "HH:mm";
    const dateDisplay = isSameDay(startTime, endTime)
      ? formatDate(startTime, dateFormat)
      : `${formatDate(startTime, dateFormat)} - ${formatDate(
          endTime,
          dateFormat
        )}`;
    const timeDisplay = `${formatDate(startTime, timeFormat)} - ${formatDate(
      endTime,
      timeFormat
    )}`;

    return (
      <ScrollView style={styles.container}>
        <Header
          onBackButtonPress={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={styles.content}>
          <Text type="h1">{event.fields.name[locale]}</Text>
          <View style={styles.categoryLabelContainer}>
            {event.fields.eventCategories[locale].map(categoryName => (
              <CategoryLabel key={categoryName} categoryName={categoryName} />
            ))}
          </View>
          <View style={styles.iconItemWrapper}>
            <IconItem icon={<Text type="xSmall">icn</Text>} title={dateDisplay}>
              <Text type="small">{timeDisplay}</Text>
            </IconItem>
          </View>
          <View style={styles.iconItemWrapper}>
            <IconItem
              icon={<Text type="xSmall">icn</Text>}
              title={event.fields.locationName[locale]}
            />
          </View>
          <View style={styles.iconItemWrapper}>
            <IconItem
              icon={<Text type="xSmall">icn</Text>}
              title={`${text.eventDetailsPrice}${
                event.fields.eventPriceLow[locale]
              }`}
            />
          </View>
          {event.fields.venueDetails[locale].includes(
            strings.venuedetailsGenderNeutralToilets
          ) && (
            <View style={styles.iconItemWrapper}>
              <IconItem
                icon={<Text type="xSmall">icn</Text>}
                title={text.eventDetailsGenderNeutralToilets}
              />
            </View>
          )}
          <View style={styles.iconItemWrapper}>
            <IconItem
              icon={<Text type="xSmall">icn</Text>}
              title={text.eventDetailsAccessibility}
            >
              <Text type="small">
                {event.fields.accessibilityOptions[locale].join(", ")}
              </Text>
            </IconItem>
          </View>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.content}>
          <Text markdown>{event.fields.eventDescription[locale]}</Text>
          <View style={styles.mapWrapper}>
            <EventMap
              lat={event.fields.location[locale].lat}
              lon={event.fields.location[locale].lon}
              locationName={event.fields.locationName[locale]}
            />
          </View>
        </View>
        {(event.fields.accessibilityDetails ||
          event.fields.email ||
          event.fields.phone ||
          event.fields.ticketingUrl) && (
          <View>
            <View style={styles.sectionDivider} />
            <View style={styles.content}>
              {event.fields.accessibilityDetails && (
                <View style={styles.detailsSection}>
                  <Text type="h2">{text.eventDetailsAccessibilityDetails}</Text>
                  <View style={styles.accessibilityDetailsItem}>
                    <Text>{event.fields.accessibilityDetails[locale]}</Text>
                  </View>
                </View>
              )}
              {(event.fields.email || event.fields.phone) && (
                <View style={styles.detailsSection}>
                  <Text type="h2">{text.eventDetailsContact}</Text>
                  {event.fields.email && (
                    <View style={styles.contactItem}>
                      <IconItem
                        icon={<Text type="xSmall">icn</Text>}
                        title={event.fields.email[locale]}
                      />
                    </View>
                  )}
                  {event.fields.phone && (
                    <View style={styles.contactItem}>
                      <IconItem
                        icon={<Text type="xSmall">icn</Text>}
                        title={event.fields.phone[locale]}
                      />
                    </View>
                  )}
                </View>
              )}
              {event.fields.ticketingUrl && (
                <View style={styles.buyButton}>
                  <Button
                    text={text.eventDetailsBuyButton}
                    url={event.fields.ticketingUrl[locale]}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: eventDetailsBgColor
  },
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: eventDetailsBgColor
  },
  categoryLabelContainer: {
    marginTop: 16,
    marginBottom: 28,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  iconItemWrapper: {
    marginBottom: 20
  },
  sectionDivider: {
    height: 4,
    backgroundColor: eventDetailsHeaderBgColor
  },
  mapWrapper: {
    marginTop: 8
  },
  detailsSection: {
    marginBottom: 20
  },
  accessibilityDetailsItem: {
    marginTop: 8
  },
  contactItem: {
    marginTop: 16
  },
  buyButton: {
    marginTop: 16
  }
});

export default EventDetailsScreen;
