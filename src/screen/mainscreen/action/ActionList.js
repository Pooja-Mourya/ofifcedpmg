import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../../../components/layout/Header';
import {COLORS, constants, FONTS, SIZES} from '../../../constants';
import {FAB, RadioButton} from 'react-native-paper';
import ApiMethod from '../../../Services/APIService';
import {useSelector} from 'react-redux';
import {RefreshControl} from 'react-native';
import {Modal} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import ActionFilter from './ActionFilter';
import TextButton from '../../../components/TextButton';
import {Dropdown} from 'react-native-element-dropdown';

const ActionList = props => {
  const token = useSelector(state => state?.user?.user?.access_token);

  const {navigation} = props;
  const [listState, setListState] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [filterModal, setFilterModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [viewStatus, setViewStatus] = useState(false);

  const handleActionList = async () => {
    const url = constants.endPoint.actionList;
    const params = {
      //   page: 1,
      //   per_page_record: '10',
    };
    // setIsRefreshing(true);
    try {
      const result = await ApiMethod.postData(url, params, token);
      console.log('result', result.data?.data);
      setListState(result?.data?.data);
      setIsRefreshing(false);
      return;
    } catch (error) {
      console.log('error', error);
    }
  };

  const ActionHandler = async id => {
    const url = constants.endPoint.actionItemAction;
    const params = {
      ids: [id],
      action: checked,
    };
    try {
      const ActionRes = await ApiMethod.postData(url, params, token);
      if (ActionRes) {
        Alert.alert('Action item Action Update Successfully');
      }
      setChecked(false);
      setActionModal(false);
      handleActionList();
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    handleActionList();
  }, [page]);

  return (
    <>
      <Header
        userName={'Niharika'}
        userTitle={'manager'}
        searchBar={true}
        rightIcon={true}
        leftIcon={true}
        onPressArrow={() => navigation.goBack()}
        onPressSort={() => setFilterModal(!filterModal)}
        userProfile={true}
      />

      <FlatList
        data={listState}
        // data={Array.isArray(listState) ? listState : []}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              handleActionList(null, true);
            }}
          />
        }
        renderItem={({item, index}) => {
          //   console.log('item', item?.documents[0]?.uploading_file_name);
          //   const createdDateFormate = moment(item.created_at).format('L');
          //   const meetingDateFormate = moment(item.meeting_date).format('L');
          //   const meetingTimeFormate = moment(item.meeting_time).format('LT');
          return (
            <>
              <View
                style={{
                  backgroundColor: COLORS.support1_08,
                  margin: 10,
                  //   borderRadius: SIZES.radius,
                  elevation: 1,
                }}
              >
                <View
                  style={{
                    padding: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    width: '50%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}
                >
                  {/* <TouchableOpacity onPress={() => setViewStatus(!viewStatus)}>
                    <MaterialCommunityIcons
                      name="gesture-tap-hold"
                      size={25}
                      color={COLORS.dark}
                    />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ViewActionItem', item)}
                  >
                    <AntDesign name="eyeo" size={25} color={COLORS.dark} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('AddActionItem', item)}
                  >
                    <AntDesign name="edit" size={25} color={COLORS.dark} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setActionModal(true)}>
                    <MaterialCommunityIcons
                      name="list-status"
                      size={25}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{padding: SIZES.padding}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                    >
                      Task:{' '}
                    </Text>
                    <Text style={{width: '50%'}}>{item.task}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                    >
                      Comment:{' '}
                    </Text>
                    <Text style={{width: '50%'}}>{item.comment}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                    >
                      Date:{' '}
                    </Text>
                    <Text style={{width: '50%'}}>{item.date_opened}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                    >
                      Percentage:{' '}
                    </Text>
                    <Text style={{width: '50%'}}>
                      {item.complete_percentage} %
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                    >
                      Status:{' '}
                    </Text>
                    <Text style={{width: '50%'}}>{item.status}</Text>
                  </View>
                </View>
              </View>

              <Modal
                animationType="slide"
                transparent={true}
                visible={actionModal}
                onRequestClose={() => {
                  setActionModal(!actionModal);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.light20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{backgroundColor: COLORS.success, width: '80%'}}>
                    <Text> id : {item.id}</Text>
                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value={item.status}
                        status={
                          checked === item.status ? 'checked' : 'unchecked'
                        }
                        onPress={() => setChecked(!checked)}
                      />
                      <Text style={{marginTop: 8}}>
                        {!checked ? 'Active' : 'inactive'}
                      </Text>
                    </View>
                    <TextButton
                      label={'submit'}
                      contentContainerStyle={{
                        padding: 10,
                        borderRadius: SIZES.radius,
                      }}
                      onPress={() => ActionHandler()}
                    />
                  </View>
                </View>
              </Modal>
            </>
          );
        }}
        onEndReached={() => {
          //   console.log('load more');
          //   setPage(page + 1);
          handleActionList(page + 1);
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <ActivityIndicator size={'large'} color={'rosybrown'} />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddActionItem')}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModal}
        onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          setFilterModal(!filterModal);
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            padding: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.gray,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              backgroundColor: COLORS.support1,
              padding: SIZES.padding,
              borderRadius: SIZES.radius,
            }}
          >
            <ActionFilter
              filterModal={filterModal}
              setFilterModal={setFilterModal}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ActionList;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
