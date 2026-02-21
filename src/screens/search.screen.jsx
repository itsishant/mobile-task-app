import { Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { GetSubscription } from "../api/get/[...subscriptionApi]/subscription.api";
import { FlatList } from "react-native";

const STATUS_COLORS = {
  Active: { bg: 'rgba(16,185,129,0.1)', text: '#34d399' },
  Inactive: { bg: 'rgba(253,224,71,0.1)', text: '#fde047' },
  Paused: { bg: 'rgba(56,189,248,0.1)', text: '#38bdf8' },
  Cancelled: { bg: 'rgba(251,113,133,0.1)', text: '#fb7185' },
  Default: { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af' },
};

const formatDate = dateString => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateString;
  }
};

export const SearchScreen = () => {
  const navigation = useNavigation();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const data = await GetSubscription();
        setSubscriptions(data || []);
        setError('');
      } catch (err) {
        setError('Failed to load subscriptions');
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId', 'email']);
      navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    } catch (error) {}
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.subscriptionDetails.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.subscriptionDetails.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSubscription = ({ item }) => {
    const statusColor = STATUS_COLORS[item.status] || STATUS_COLORS.Default;
    return (
      <View
        style={{
          borderWidth: 0.6,
          borderColor: '#52525b',
          borderRadius: 16,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#d4d4d8',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 18,
                }}
              >
                {item.subscriptionDetails.appName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#e5e5e5',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                }}
              >
                {item.subscriptionDetails.appName}
              </Text>
              <Text
                style={{
                  color: '#a3a3a3',
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                {item.subscriptionDetails.category}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: statusColor.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              alignSelf: 'flex-start',
            }}
          >
            <Text
              style={{
                color: statusColor.text,
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 22,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.billingDetails.currency === 'USD'
              ? '$'
              : item.billingDetails.currency === 'EUR'
                ? '€'
                : item.billingDetails.currency === 'GBP'
                  ? '£'
                  : '₹'}
            {item.billingDetails.amount}
            <Text
              style={{
                color: '#a3a3a3',
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
              }}
            >
              {' '}
              / {item.subscriptionDetails.planType?.toLowerCase()}
            </Text>
          </Text>
          {item.billingDetails.autoRenew && (
            <Text style={{ color: '#a3a3a3', fontSize: 12, marginTop: 2 }}>
              Auto-renews
            </Text>
          )}
        </View>
        <View
          style={{
            borderBottomColor: '#27272a',
            borderBottomWidth: 1,
            marginBottom: 12,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Payment
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.billingDetails.paymentMethod}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Next billing
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {formatDate(item.datesDetails.nextBillingDate)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: '#a3a3a3',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Reminder
          </Text>
          <Text
            style={{
              color: '#e5e5e5',
              fontSize: 13,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {item.reminderDaysBefore}d before
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#18181b',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: '#e5e5e5',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#18181b',
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Text
              style={{
                color: '#fb7185',
                fontSize: 13,
                fontFamily: 'Poppins-Regular',
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: '#09090b', minHeight: '100%' }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#000' }}>
        <View
          style={{
            paddingVertical: 24,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#000',
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={require('../../public/logo.png')}
              style={{ width: 40, height: 40 }}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 24,
                color: '#e5e5e5',
              }}
            >
              Loopify
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Icon
              name="logout"
              size={30}
              color="#fff"
              style={{
                backgroundColor: '#b91c1c',
                borderRadius: 20,
                padding: 6,
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <View style={{ position: 'relative', marginBottom: 16 }}>
          <TextInput  className="border border-neutral-600"
            style={{
              color: '#fff',
              padding: 16,
              borderRadius: 16,
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
              paddingRight: 40,
            }}
            placeholder="Search subscriptions..."
            placeholderTextColor="#737373"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon
            name="search"
            size={26}
            color="#737373"
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
            }}
          />
        </View>
        {loading ? (
          <View style={{ marginTop: 32, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        ) : error ? (
          <Text style={{ color: '#fb7185', fontSize: 16, textAlign: 'center', marginTop: 32 }}>
            {error}
          </Text>
        ) : filteredSubscriptions.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={{ color: '#e5e5e5', fontSize: 18, marginBottom: 8 }}>
              No subscriptions found
            </Text>
            <Text style={{ color: '#a3a3a3', fontSize: 14, textAlign: 'center' }}>
              Try searching with app name or category
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSubscriptions}
            renderItem={renderSubscription}
            keyExtractor={item =>
              item._id?.toString() || Math.random().toString()
            }
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </View>
  );
};
