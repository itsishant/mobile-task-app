import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GetSubscription } from '../api/get/[...subscriptionApi]/subscription.api';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(() => ({
    total: 0,
    active: 0,
    inactive: 0,
    paused: 0,
    totalSpent: 0,
  }));

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const emailData = await AsyncStorage.getItem('email');
        const userIdData = await AsyncStorage.getItem('userId');
        setEmail(emailData || '');
        setUserId(userIdData || '');

        const subsData = await GetSubscription();
        setSubscriptions(subsData || []);

        if (subsData && subsData.length > 0) {
          const activeCount = subsData.filter(
            sub => sub.status === 'Active'
          ).length;
          const inactiveCount = subsData.filter(
            sub => sub.status === 'Inactive'
          ).length;
          const pausedCount = subsData.filter(
            sub => sub.status === 'Paused'
          ).length;
          const totalAmount = subsData.reduce(
            (sum, sub) => sum + (parseFloat(sub.billingDetails.amount) || 0),
            0
          );

          setStats({
            total: subsData.length,
            active: activeCount,
            inactive: inactiveCount,
            paused: pausedCount,
            totalSpent: totalAmount.toFixed(2),
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId', 'email']);
      navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const StatCard = ({ label, value, icon, color }) => (
    <View className="flex-1 bg-black rounded-2xl p-4 border border-neutral-600 mx-1.5">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-neutral-400 text-xs" style={{ fontFamily: 'Poppins-Regular' }}>
          {label}
        </Text>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text className="text-neutral-100 text-2xl" style={{ fontFamily: 'Poppins-Bold' }}>
        {value}
      </Text>
    </View>
  );

  const MenuItem = ({ icon, label, onPress, color = '#e5e5e5' }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-black rounded-lg p-4 mb-3 border border-neutral-600"
    >
      <View className="flex-row items-center gap-3">
        <Icon name={icon} size={24} color={color} />
        <Text className="text-base" style={{ color, fontFamily: 'Poppins-Regular' }}>
          {label}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#a3a3a3" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#09090b',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
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
              Profile
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

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          paddingBottom: 32,
        }}
      >
        <View className="items-center mb-8 pb-6 border-b border-neutral-600">
          <View className="w-20 h-20 rounded-full bg-black border-2 border-emerald-400 items-center justify-center mb-4">
            <Text
              style={{
                fontSize: 32,
                fontFamily: 'Poppins-Bold',
                color: '#34d399',
              }}
            >
              {email ? email.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text className="text-neutral-100 text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins-Bold' }}>
            {email ? email.split('@')[0] : 'User'}
          </Text>
          <Text className="text-neutral-400 text-sm" style={{ fontFamily: 'Poppins-Regular' }}>
            {email}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-neutral-100 text-base mb-3" style={{ fontFamily: 'Poppins-Regular' }}>
            Subscription Stats
          </Text>
          <View className="flex-row mb-3">
            <StatCard
              label="Total"
              value={stats.total}
              icon="list"
              color="#34d399"
            />
            <StatCard
              label="Active"
              value={stats.active}
              icon="check-circle"
              color="#38bdf8"
            />
          </View>
          <View className="flex-row">
            <StatCard
              label="Paused"
              value={stats.paused}
              icon="pause-circle"
              color="#fde047"
            />
            <StatCard
              label="Spent"
              value={`$${stats.totalSpent}`}
              icon="trending-down"
              color="#fb7185"
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-neutral-100 mb-3" style={{ fontFamily: 'Poppins-Regular' }}>
            Settings
          </Text>
          <MenuItem
            icon="person"
            label="Account Information"
            onPress={() => {}}
          />
          <MenuItem
            icon="notifications"
            label="Notifications"
            onPress={() => {}}
          />
          <MenuItem icon="security" label="Privacy" onPress={() => {}} />
          <MenuItem icon="help" label="Help & Support" onPress={() => {}} />
          <MenuItem
            icon="info"
            label="About Loopify"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-700 rounded-lg py-3.5 items-center flex-row justify-center gap-2"
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text className="text-white text-base" style={{ fontFamily: 'Poppins-Bold' }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
